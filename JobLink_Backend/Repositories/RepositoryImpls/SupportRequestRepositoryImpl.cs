using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;

namespace JobLink_Backend.Repositories.RepositoryImpls;

public class SupportRequestRepositoryImpl : EFRepository<SupportRequest>, ISupportRequestRepository
{
    private readonly JobLinkContext _context;

    public SupportRequestRepositoryImpl(JobLinkContext context) : base(context)
    {
        _context = context;
    }
}