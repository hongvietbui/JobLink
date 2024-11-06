using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;

namespace JobLink_Backend.Repositories.RepositoryImpls
{
    public class WorkerRepositoryImpl : EFRepository<Worker>, IWorkerRepository
    {
        private readonly JobLinkContext _context;

        public WorkerRepositoryImpl(JobLinkContext context) : base(context) 
        {
            _context = context;
        }
    }
}
