namespace JobLink_Backend.Services.IServices
{
    public interface IChatService
    {
        Task SendMessageAsync(Guid senderId, Guid receiverId, string message);
    }
}
