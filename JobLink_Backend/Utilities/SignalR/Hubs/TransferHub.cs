using Microsoft.AspNetCore.SignalR;

namespace JobLink_Backend.Utilities.SignalR.Hubs;

public class TransferHub : Hub
{
    public override Task OnConnectedAsync()
    {
        var userId = Context.GetHttpContext().Request.Query["userId"].ToString();
        Groups.AddToGroupAsync(Context.ConnectionId, userId);

        return base.OnConnectedAsync();
    }

    public async Task SendTransferMessageToUser(Guid userId, string message)
    {
        await Clients.Group(userId.ToString()).SendAsync("ReceiveTransfer", message);
    }
}