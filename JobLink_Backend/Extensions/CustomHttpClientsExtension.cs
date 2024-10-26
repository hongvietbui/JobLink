namespace JobLink_Backend.Extensions;

public static class CustomHttpClientsExtension
{
    public static IServiceCollection AddCustomHttpClients(this IServiceCollection services)
    {
        services.AddHttpClient("CassoAPI", client =>
        {
            client.BaseAddress = new Uri("https://oauth.casso.vn/v2/");
        });
        services.AddHttpClient("VietQRAPI", client =>
        {
            client.BaseAddress = new Uri("https://api.vietqr.io/v2/");
        });
        return services;
    }
}