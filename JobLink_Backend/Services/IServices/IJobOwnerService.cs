using JobLink_Backend.Entities;

namespace JobLink_Backend.Services.IServices
{
    public interface IJobOwnerService
    {
        Task<JobOwner> GetJobOwnerByIdAsync(Guid id);
        Task<string> GetJobOwnerIdByUserIdAsync(Guid userId);
    }
}
