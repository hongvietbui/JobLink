using JobLink_Backend.Entities;
using Microsoft.AspNetCore.SignalR;

namespace JobLink_Backend.Hubs;

public class ConversationHub:Hub
{
    private readonly JobLinkContext _context;

    public ConversationHub(JobLinkContext context)
    {
        _context = context;
    }

    public async Task SendNewMessage(Guid conversationId, Guid senderId, string messageContent)
    {
        var message = new Message
        {
            Content = messageContent,
            SentAt = DateTime.UtcNow,
            SenderId = senderId,
            ConversationId = conversationId
        };

        _context.Messages.Add(message);
        await _context.SaveChangesAsync();

        await Clients.Group(conversationId.ToString()).SendAsync("ReceiveNewMessage", senderId, messageContent);
    }

    public override async Task OnConnectedAsync()
    {
        var httpContext = Context.GetHttpContext();
        var conversationId = httpContext.Request.Query["conversationId"];
        
        await Groups.AddToGroupAsync(Context.ConnectionId, conversationId);
        await base.OnConnectedAsync();
    }
}