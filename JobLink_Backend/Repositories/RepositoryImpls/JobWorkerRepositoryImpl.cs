using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;

namespace JobLink_Backend.Repositories.RepositoryImpls
{
    public class JobWorkerRepositoryImpl : EFRepository<JobWorker>, IJobWorkerRepository
    {
        private readonly JobLinkContext _context;

        public JobWorkerRepositoryImpl(JobLinkContext context) : base(context)
        {
            _context = context;
        }
    }
}
