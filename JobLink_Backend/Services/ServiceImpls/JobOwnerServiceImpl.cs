using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;

namespace JobLink_Backend.Services.ServiceImpls
{
    public class JobOwnerServiceImpl : IJobOwnerService
    {
        private readonly IJobOwnerRepository _jobOwnerRepository;
        public JobOwnerServiceImpl(IJobOwnerRepository jobOwnerRepository)
        {
            _jobOwnerRepository = jobOwnerRepository;
        }
        public async Task<JobOwner> GetJobOwnerBySenderIdAsync(Guid senderId)
        {
            return await _jobOwnerRepository.GetByIdAsync(senderId);
        }
    }
}
