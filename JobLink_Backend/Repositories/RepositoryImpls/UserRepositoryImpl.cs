using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace JobLink_Backend.Repositories.RepositoryImpls;

public class UserRepositoryImpl : EFRepository<User>, IUserRepository
{
    private readonly JobLinkContext _context;

    public UserRepositoryImpl(JobLinkContext context) : base(context)
    {
        _context = context;
    }

    public override async Task AddAsync(User entity)
    {
        var roleNames = entity.Roles.Select(r => r.Name).ToList();
        
        var roles = await _context.Roles
            .Where(r => roleNames.Contains(r.Name))
            .ToListAsync();
        
        entity.Roles = roles;
        
        await _context.AddAsync(entity);
    }
    public async Task<User> GetById(Guid userId)
    {
        return await _context.Set<User>().FindAsync(userId);
    }

    public async Task Update(User user)
    {
        _context.Set<User>().Update(user); 
          }

    public async Task SaveChangeAsync() => await _context.SaveChangesAsync();
}