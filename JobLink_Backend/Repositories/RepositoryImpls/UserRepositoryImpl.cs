using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;

namespace JobLink_Backend.Repositories.RepositoryImpls;

public class UserRepositoryImpl : EFRepository<User>, IUserRepository
{
    private readonly JobLinkContext _context;
    
    public UserRepositoryImpl(JobLinkContext context) : base(context)
    {
        _context = context;
    }
}