using JobLink_Backend.Hubs;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Repositories.RepositoryImpls;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Services.ServiceImpls;
using JobLink_Backend.Utilities.AmazonS3;

namespace JobLink_Backend.Extensions;

public static class CustomServiceExtension
{
    public static IServiceCollection AddCustomServices(this IServiceCollection services)
    {
        //repositories
        services.AddScoped<IUserRepository, UserRepositoryImpl>();
        services.AddScoped<IRoleRepository, RoleRepositoryImpl>();
        services.AddScoped<IJobRepository, JobRepositoryImpl>();
        services.AddScoped<ITransactionRepository, TransactionRepositoryImpl>();
        services.AddScoped<IWorkerRepository, WorkerRepositoryImpl>();
        services.AddScoped<IJobOwnerRepository, JobOwnerRepositoryImpl>();
        
        services.AddSignalR();
        services.AddScoped<IUnitOfWork, UnitOfWork>();
        
        //services
        services.AddScoped<IUserService, UserServiceImpl>();
        services.AddScoped<IJobService, JobServiceImpl>();
        services.AddScoped<INotificationService, NotificationServiceImpl>();
        services.AddScoped<IChatService, ChatServiceImpl>();
        services.AddScoped<IWorkerService, WorkerServiceImpl>();
        services.AddScoped<IJobOwnerService, JobOwnerServiceImpl>();

        services.AddScoped<IVietQrService, VietQRServiceImpl>();
        services.AddScoped<S3Uploader>();
        services.AddScoped<ITransactionService, TransactionServiceImpl>();
        services.AddScoped<IEmailService, EmailServiceImpl>();
        return services;
    }
}