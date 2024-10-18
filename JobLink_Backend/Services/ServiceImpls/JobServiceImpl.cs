using System.Security.Claims;
using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities.Jwt;

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

}