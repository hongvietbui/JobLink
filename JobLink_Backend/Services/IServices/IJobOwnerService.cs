using JobLink_Backend.Entities;

namespace JobLink_Backend.Services.IServices
{
    public interface IJobOwnerService
    {
        Task<JobOwner> GetJobOwnerBySenderIdAsync(Guid senderId);
    }
}
