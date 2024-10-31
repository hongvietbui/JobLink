using Microsoft.AspNetCore.SignalR;

namespace JobLink_Backend.Hubs;

public class ChatHub : Hub
{
    public override Task OnConnectedAsync()
    {
        var userId = Context.GetHttpContext().Request.Query["userId"].ToString();
        Groups.AddToGroupAsync(Context.ConnectionId, userId);
        return base.OnConnectedAsync();
    }
    public async Task SendMessage(string user, string message)
    {
        // Gửi tin nhắn cho tất cả người dùng kết nối
        await Clients.All.SendAsync("ReceiveMessage", user, message);
    }
}