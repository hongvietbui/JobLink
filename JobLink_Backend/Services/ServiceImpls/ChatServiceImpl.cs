using JobLink_Backend.Hubs;
using JobLink_Backend.Services.IServices;
using Microsoft.AspNetCore.SignalR;

namespace JobLink_Backend.Services.ServiceImpls
{
    public class ChatServiceImpl : IChatService
    {
        private readonly IHubContext<ChatHub> _context;

        public ChatServiceImpl(IHubContext<ChatHub> context)
        {
            _context = context;
        }

        public async Task SendMessageAsync(Guid senderId, Guid receiverId, string message)
        {
            await _context.Clients.Group(receiverId.ToString()).SendAsync("ReceiveMessage", senderId, message);
        }
    }
}
