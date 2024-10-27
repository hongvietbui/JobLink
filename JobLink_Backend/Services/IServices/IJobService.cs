using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request.Jobs;
using JobLink_Backend.DTOs.Response.Jobs;
using JobLink_Backend.Entities;
using JobLink_Backend.Utilities.Pagination;
using System.Linq.Expressions;

namespace JobLink_Backend.Services.IServices;

public interface IJobService
{
    Task<JobDTO?> GetJobByIdAsync(Guid jobId);
    Task<Role?> GetUserRoleInJobAsync(Guid jobId, string accessToken);
    Task<Pagination<JobDTO>> GetJobsAsync(int pageIndex, int pageSize, string sortBy, bool isDescending, Expression<Func<Job, bool>> filter = null);

    
    Task<Pagination<JobDTO>>? GetAllJobsDashboardAsync(JobListRequestDTO filter, string accessToken);
    Task<List<JobStatisticalResponseDto>> GetJobStatisticalAsync(JobStatisticalDto filter, string accessToken);
}
