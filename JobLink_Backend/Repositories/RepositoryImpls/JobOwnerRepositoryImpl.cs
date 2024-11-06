using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;

namespace JobLink_Backend.Repositories.RepositoryImpls
{
    public class JobOwnerRepositoryImpl : EFRepository<JobOwner>, IJobOwnerRepository
    {
        private readonly JobLinkContext _context;

        public JobOwnerRepositoryImpl(JobLinkContext context) : base(context) { 
            _context = context;
        }

    }
}
