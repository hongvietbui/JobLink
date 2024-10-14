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

    public User GetById(int userId)
    {
        return _context.Set<User>().Find(userId);
    }

    public void Update(User user)
    {
        _context.Set<User>().Update(user);
    }

    public void SaveChanges()
    {
        _context.SaveChanges();
    }
}