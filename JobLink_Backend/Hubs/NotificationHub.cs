using Microsoft.AspNetCore.SignalR;

namespace JobLink_Backend.Hubs
{
    public class NotificationHub : BaseHub
    {
        public async Task SendNotificationToUser(Guid userId, string title, string message, string timeStamp)
        {
            await Clients.User(userId.ToString()).SendAsync("ReceiveNotification ", title, message, timeStamp);
        }
        
        public async Task SendNotificationToGroup(string groupName, string title, string message, string timestamp)
        {
            await Clients.Group(groupName).SendAsync("ReceiveNotification", message);
        }
        
        public async Task SendNotificationToAll(string title, string message, string timestamp)
        {
            await Clients.All.SendAsync("ReceiveNotification", title, message, timestamp);
        }
    }
}
