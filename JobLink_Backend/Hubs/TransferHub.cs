using Microsoft.AspNetCore.SignalR;

namespace JobLink_Backend.Hubs;

public class TransferHub : BaseHub
{
    public async Task SendTransferMessageToUser(Guid userId, string message)
    {
        await Clients.Group(userId.ToString()).SendAsync("ReceiveTransfer", message);
    }
}