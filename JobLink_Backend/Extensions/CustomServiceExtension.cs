using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Repositories.RepositoryImpls;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Services.ServiceImpls;

namespace JobLink_Backend.Extensions;

public static class CustomServiceExtension
{
    public static IServiceCollection AddCustomServices(this IServiceCollection services)
    {
        //repositories
        services.AddScoped<IUserRepository, UserRepositoryImpl>();
        services.AddScoped<IRoleRepository, RoleRepositoryImpl>();
        
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        
        //services
        services.AddScoped<IUserService, UserServiceImpl>();
        return services;
    }
}