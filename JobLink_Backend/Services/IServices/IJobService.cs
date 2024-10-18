using JobLink_Backend.DTOs.All;

namespace JobLink_Backend.Services.IServices;

public interface IJobService
{
    Task<JobDTO?> GetJobByIdAsync(Guid jobId);
}