using JobLink_Backend.Utilities.Jwt;
using Microsoft.AspNetCore.Authentication.JwtBearer;

namespace JobLink_Backend.Extensions;

public static class AuthenticationExtension
{
    public static IServiceCollection AddCustomAuthentication(this IServiceCollection services)
    {
        services.AddSingleton<JwtService>();

        services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                var serviceProvider = services.BuildServiceProvider();
                var jwtService = serviceProvider.GetRequiredService<JwtService>();

                options.TokenValidationParameters = jwtService.GetTokenValidationParameters();
            });
        return services;
    }
}