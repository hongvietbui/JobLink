using JobLink_Backend.Hubs;
using JobLink_Backend.Services.IServices;
using Microsoft.AspNetCore.SignalR;

namespace JobLink_Backend.Services.ServiceImpls;

public class NotificationServiceImpl(IHubContext<NotificationHub> hubContext) : INotificationService
{
    private readonly IHubContext<NotificationHub> _hubContext = hubContext;
    
    public async Task sendNotificationAsync(string title, string message, string timestamp)
    {
        await _hubContext.Clients.All.SendAsync("ReceiveNotification", title, message, timestamp);
    }

    public async Task sendNotificationToUserAsync(Guid userId, string title, string message, string timestamp)
    {
        await _hubContext.Clients.Group(userId.ToString()).SendAsync("ReceiveNotification", title, message, timestamp);
    }
}