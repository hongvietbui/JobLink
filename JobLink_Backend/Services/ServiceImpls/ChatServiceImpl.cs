using JobLink_Backend.Hubs;
using JobLink_Backend.Services.IServices;
using Microsoft.AspNetCore.SignalR;

namespace JobLink_Backend.Services.ServiceImpls
{
    public class ChatServiceImpl(IHubContext<ChatHub> hubContext, IHubContext<NotificationHub> notificationHub) : IChatService
    {
        private readonly IHubContext<ChatHub> _hubContext = hubContext;
        private readonly IHubContext<NotificationHub> _notificationHub = notificationHub;

        public async Task SendMessageAsync(Guid senderId, Guid receiverId, string message)
        {
            await _hubContext.Clients.Group(receiverId.ToString()).SendAsync("ReceiveMessage", senderId, message);
            await _notificationHub.Clients.Group(receiverId.ToString()).SendAsync("ReceiveNotification", "New message", "You have a new message", DateTime.Now.ToString());
        }
    }
}
