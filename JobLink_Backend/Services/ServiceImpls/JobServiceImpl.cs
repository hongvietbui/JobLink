using System.Linq.Expressions;
using System.Security.Claims;
using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request.Jobs;
using JobLink_Backend.DTOs.Response.Jobs;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities.Jwt;
using JobLink_Backend.Utilities.Pagination;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace JobLink_Backend.Services.ServiceImpls;

public class JobServiceImpl(IUnitOfWork unitOfWork, IMapper mapper, JwtService jwtService) : IJobService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IMapper _mapper = mapper;
    private readonly JwtService _jwtService = jwtService;

    public async Task<JobDTO?> GetJobByIdAsync(Guid jobId)
    {
        var job = await _unitOfWork.Repository<Job>().FirstOrDefaultAsync(j => j.Id == jobId);
        return _mapper.Map<JobDTO>(job);
    }

    public async Task<Role?> GetUserRoleInJobAsync(Guid jobId, string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;

        var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }

        var job = await _unitOfWork.Repository<Job>().FirstOrDefaultAsync(j => j.Id == jobId);

        if (job == null)
        {
            throw new Exception("Job not found.");
        }

        if (job.OwnerId == userId)
        {
            return await _unitOfWork.Repository<Role>().FirstOrDefaultAsync(r => r.Name == "JobOwner");
        }

        if (job.WorkerId == userId)
        {
            return await _unitOfWork.Repository<Role>().FirstOrDefaultAsync(r => r.Name == "Worker");
        }

        return null;
    }

    public async Task<Pagination<JobDTO>>? GetAllJobsDashboardAsync(JobListRequestDTO filter, string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;

        var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }


        Expression<Func<Job, bool>> filterExpression = t =>
            (string.IsNullOrEmpty(filter.Filter) || t.Name.Contains(filter.Filter)
                                                 || t.Description.Contains(filter.Filter))
            && (filter.Status == null || t.Status == filter.Status)
            && ((filter.IsOwner == null && (t.OwnerId == userId || t.WorkerId == userId)) ||
                (filter.IsOwner == true && t.OwnerId == userId) ||
                (filter.IsOwner == false && t.WorkerId == userId));


        Func<IQueryable<Job>, IIncludableQueryable<Job, object>> include = query =>
            query.Include(u => u.Owner)
                .Include(u => u.Worker);


        var listJob = await _unitOfWork.Repository<Job>()
            .GetAllAsync(filterExpression, filter.PageNumber, filter.PageSize, include);

        return _mapper.Map<Pagination<JobDTO>>(listJob);
    }

    public async Task<List<JobStatisticalResponseDto>> GetJobStatisticalAsync(JobStatisticalDto filter, string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;

        var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }

        Expression<Func<Transactions, bool>> filterExpression = t =>
            t.UserId == userId;
        Expression<Func<Job, bool>> filterEarnExpression = t =>
            t.WorkerId == userId && t.Status == JobStatus.Completed;

        var listTransaction = await _unitOfWork.Repository<Transactions>().GetAllAsync(filterExpression);

        var listEarn = await _unitOfWork.Repository<Job>().GetAllAsync(filterEarnExpression);
        var dateRange = Enumerable.Range(0, (filter.To - filter.From).Days + 1)
            .Select(d => filter.From.AddDays(d))
            .ToList();


        var result = dateRange.Select(date => new JobStatisticalResponseDto
        {
            Date = date,
            Deposit = listTransaction
                .Where(t => t.TransactionDate.Date == date.Date && t.PaymentType == PaymentType.Deposit)
                .Sum(t => t.Amount).ToString(),
            Earn = listEarn
                .Where(t => t.UpdatedAt.Value.Date == date.Date)
                .Sum(t => t.Price).ToString(),
        }).ToList();

        return result;
    }
}