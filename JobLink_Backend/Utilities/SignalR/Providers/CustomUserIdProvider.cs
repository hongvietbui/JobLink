using Microsoft.AspNetCore.SignalR;
using System.Security.Claims;

namespace JobLink_Backend.Utilities.SignalR.Providers
{
    public class CustomUserIdProvider : IUserIdProvider
    {
        public string GetUserId(HubConnectionContext connection)
        {
            return connection.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        }
    }
}
