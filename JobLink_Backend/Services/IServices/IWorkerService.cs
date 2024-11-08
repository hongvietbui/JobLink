using JobLink_Backend.Entities;

namespace JobLink_Backend.Services.IServices
{
    public interface IWorkerService
    {
        Task<Worker> GetWorkerByIdAsync(Guid senderId);
        Task<string> getWorkerIdByUserIdAsync(Guid userId);
    }
}
