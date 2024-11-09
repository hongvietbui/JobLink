using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;

namespace JobLink_Backend.Services.ServiceImpls
{
    public class WorkerServiceImpl(IUnitOfWork unitOfWork) : IWorkerService
    {
        private readonly IUnitOfWork _unitOfWork = unitOfWork;

        public async Task<Worker> GetWorkerByIdAsync(Guid senderId)
        {
            return await _unitOfWork.Repository<Worker>().GetByIdAsync(senderId);
        }

        public async Task<string> getWorkerIdByUserIdAsync(Guid userId)
        {
            var workers = await _unitOfWork.Repository<Worker>().FindByConditionAsync(w => w.UserId == userId);
            return (workers != null && workers.Any()) ? workers.First().Id.ToString() : "";
        }
    }
}
