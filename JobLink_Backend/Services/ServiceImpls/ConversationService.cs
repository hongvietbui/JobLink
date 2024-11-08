using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;

namespace JobLink_Backend.Services.ServiceImpls;

public class ConversationService(IUnitOfWork unitOfWork, IMapper mapper) : IConversationService
{
    private IUnitOfWork _unitOfWork = unitOfWork;
    private IMapper _mapper = mapper;

    public async Task<Conversation> GetConversationByJobIdAndWorkerAsync(Guid jobId, Guid workerId)
    {
        var conversation = await _unitOfWork.Repository<Conversation>()
            .FirstOrDefaultAsync(c => c.JobId == jobId && c.WorkerId == workerId);
        return conversation;
    }

    public async Task<Conversation> CreateNewConversationAsync(Guid jobId, Guid workerId)
    {
        var job = await _unitOfWork.Repository<Job>().FirstOrDefaultAsync(j => j.Id == jobId);
        var newConversation = new Conversation
        {
            Id = Guid.NewGuid(),
            JobId = jobId,
            JobOwnerId = job.OwnerId,
            WorkerId = workerId,
            CreatedAt = DateTime.UtcNow
        };

        await _unitOfWork.Repository<Conversation>().AddAsync(newConversation);
        await _unitOfWork.SaveChangesAsync();
        return newConversation;
    }

    public async Task<List<Message>> GetAllMessagesByConversationIdAsync(Guid conversationId)
    {
        var listMessage = (await _unitOfWork.Repository<Message>().GetAllAsync(t => t.ConversationId == conversationId))
            .OrderBy(m => m.CreatedAt)
            .ToList();
        return listMessage;
    }
}