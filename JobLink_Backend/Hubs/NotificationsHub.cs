using Microsoft.AspNetCore.SignalR;

namespace JobLink_Backend.Hubs
{
    public class NotificationsHub : Hub
    {
        public async Task SendNotificationToUser(Guid userId, string message)
        {
            await Clients.User(userId.ToString()).SendAsync("ReceiveNotification ", message);
        }
    }
}
