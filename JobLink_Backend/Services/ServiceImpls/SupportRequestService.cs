using System.Linq.Expressions;
using System.Security.Claims;
using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request.SupportRequests;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities.Jwt;
using JobLink_Backend.Utilities.Pagination;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace JobLink_Backend.Services.ServiceImpls;

public class SupportRequestService(
    IUnitOfWork unitOfWork,
    IMapper mapper,
    JwtService jwtService,
    ISupportRequestRepository supportRequestRepository) : ISupportRequestService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IMapper _mapper = mapper;
    private readonly JwtService _jwtService = jwtService;
    private readonly ISupportRequestRepository _supportRequestRepository = supportRequestRepository;

    public async Task<Pagination<SupportRequestDto>> GetAllSupportRequestsAsync(SupportRequestFilter filter)
    {
        Expression<Func<SupportRequest, bool>> filterExpression = t =>
            (string.IsNullOrEmpty(filter.Query) || t.Id.ToString() == filter.Query || t.Title.Contains(filter.Query) ||
             t.Description.Contains(filter.Query))
            && (!filter.Category.HasValue || t.Category == filter.Category.Value)
            && (!filter.Priority.HasValue || t.Priority == filter.Priority.Value)
            && (!filter.Status.HasValue || t.Status == filter.Status.Value);

        Func<IQueryable<SupportRequest>, IOrderedQueryable<SupportRequest>> orderExpression =
            q => q.OrderBy(t => t.Priority);


        //Func<IQueryable<SupportRequest>, IIncludableQueryable<SupportRequest>> includeExpression = q => q.Include(t => t.User).Include(t => t.Job);
        var listSupportRequest = await _unitOfWork.Repository<SupportRequest>()
            .GetAllOrderAsync(filterExpression, filter.PageNumber, filter.PageSize,
                include: u => u.Include(r => r.User).Include(s => s.Job), orderExpression);

        return _mapper.Map<Pagination<SupportRequestDto>>(listSupportRequest);
    }

    public async Task<SupportRequestDto> AddNewSupportRequestAsync(SupportRequestCreateDto data, string imageUrl,
        string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;
        var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);

        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }

        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            throw new Exception("User not found.");
        }


        var newSupportRequest = new SupportRequest
        {
            Id = Guid.NewGuid(),
            Title = data.Title,
            Description = data.Description,
            Status = SupportRequestStatus.Open,
            Category = data.Category,
            Priority = data.Priority,
            JobId = data.JobId,
            UserId = userId,
            Attachment = imageUrl,
            CreatedBy = user.FirstName + " " + user.LastName,
            CreatedAt = DateTime.Now,
            UpdatedAt = DateTime.Now
        };

        await _unitOfWork.Repository<SupportRequest>().AddAsync(newSupportRequest);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<SupportRequestDto>(newSupportRequest);
    }

    public async Task<SupportRequestDto> GetSupportRequestByIdAsync(Guid supportRequestId)
    {
        var supportRequest = await _unitOfWork.Repository<SupportRequest>()
            .FirstOrDefaultAsync(j => j.Id == supportRequestId);
        return _mapper.Map<SupportRequestDto>(supportRequest);
    }

    public async Task<SupportRequestDto> UpdateSupportRequestStatus(Guid id)
    {
        var supportRequest = await _unitOfWork.Repository<SupportRequest>().FirstOrDefaultAsync(s => s.Id == id);

        supportRequest.UpdatedAt = DateTime.Now;
        supportRequest.Status = SupportRequestStatus.Close;
        _unitOfWork.Repository<SupportRequest>().Update(supportRequest);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<SupportRequestDto>(supportRequest);
    }
}