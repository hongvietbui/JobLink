using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Repositories.RepositoryImpls;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Services.ServiceImpls;

namespace JobLink_Backend.Extensions;

public static class CustomServiceExtension
{
    public static IServiceCollection AddCustomServices(this IServiceCollection services)
    {
        services.AddScoped<IUserRepository, UserRepositoryImpl>();
        
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        
        services.AddScoped<IUserService, UserServiceImpl>();
        return services;
    }
}