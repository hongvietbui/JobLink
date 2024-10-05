using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;

namespace JobLink_Backend.Repositories.RepositoryImpls;

public class UserRepositoryImpl(JobLinkContext context) : UnitOfWork<User>(context), IUserRepository
{
    private readonly JobLinkContext _context = context;
}