using Microsoft.AspNetCore.SignalR;

namespace JobLink_Backend.ChatHub;

public class ChatHub : Hub
{
    public async Task SendMessage(string user, string message)
    {
        // Gửi tin nhắn cho tất cả người dùng kết nối
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}