using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;

namespace JobLink_Backend.Services.IServices;

public interface IJobService
{
    Task<JobDTO?> GetJobByIdAsync(Guid jobId);
    Task<Role?> GetUserRoleInJobAsync(Guid jobId, string accessToken);
}