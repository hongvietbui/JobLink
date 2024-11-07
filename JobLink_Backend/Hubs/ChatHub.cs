using Microsoft.AspNetCore.SignalR;

namespace JobLink_Backend.Hubs;

public class ChatHub : BaseHub
{
    
    public async Task SendMessage(string user, string message)
    {
        // Gửi tin nhắn cho tất cả người dùng kết nối
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
    
    public async Task SendMessageToUser(string receiverId, string senderId, string message)
    {
        await Clients.Group(receiverId).SendAsync("ReceiveMessage", senderId, message);
    }
}