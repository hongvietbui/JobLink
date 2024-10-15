using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace JobLink_Backend.Repositories.RepositoryImpls;

public class RoleRepositoryImpl : EFRepository<Role>, IRoleRepository
{
    private readonly JobLinkContext _context;
    
    public RoleRepositoryImpl(JobLinkContext context) : base(context)
    {
        _context = context;
    }
}