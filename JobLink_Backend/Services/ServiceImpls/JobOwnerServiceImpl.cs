using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;

namespace JobLink_Backend.Services.ServiceImpls
{
    public class JobOwnerServiceImpl(IUnitOfWork unitOfWork) : IJobOwnerService
    {
        private IUnitOfWork _unitOfWork = unitOfWork;
        public async Task<JobOwner> GetJobOwnerByIdAsync(Guid id)
        {
            return await _unitOfWork.Repository<JobOwner>().GetByIdAsync(id);
        }

        public async Task<string> GetJobOwnerIdByUserIdAsync(Guid userId)
        {
            var jobOwners = await _unitOfWork.Repository<JobOwner>().FindByConditionAsync(jo => jo.UserId == userId);
            return jobOwners != null && jobOwners.Any() ? jobOwners.First().Id.ToString() : "";
        }
    }
}
