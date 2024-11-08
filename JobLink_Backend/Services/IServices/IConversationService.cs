using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;

namespace JobLink_Backend.Services.IServices;

public interface IConversationService
{
    Task<Conversation> GetConversationByJobIdAndWorkerAsync(Guid jobId, Guid workerId);
    Task<Conversation> CreateNewConversationAsync(Guid jobId, Guid workerId);
    Task<List<Message>> GetAllMessagesByConversationIdAsync(Guid conversationId);
}