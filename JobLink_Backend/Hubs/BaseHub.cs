using Microsoft.AspNetCore.SignalR;

namespace JobLink_Backend.Hubs;

public class BaseHub : Hub
{
    public override Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        if (httpContext == null)
        {
            // Log hoặc xử lý lỗi
            throw new InvalidOperationException("HttpContext is null.");
        }

        var userId = httpContext.Request.Query["userId"].ToString();
        if (string.IsNullOrEmpty(userId))
        {
            // Log hoặc xử lý lỗi
            throw new ArgumentException("UserId is missing or invalid.");
        }

        Groups.AddToGroupAsync(Context.ConnectionId, userId);
        return base.OnConnectedAsync();
    }
}