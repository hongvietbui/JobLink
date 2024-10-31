using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;

namespace JobLink_Backend.Services.ServiceImpls
{
    public class WorkerServiceImpl : IWorkerService
    {
        private readonly IWorkerRepository _workerRepository;
        public WorkerServiceImpl(IWorkerRepository workerRepository) 
        {
            _workerRepository = workerRepository;
        }

        public async Task<Worker> GetWorkerBySenderIdAsync(Guid senderId)
        {
            return await _workerRepository.GetByIdAsync(senderId);
        }

    }
}
