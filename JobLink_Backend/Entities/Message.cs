using JobLink_Backend.Utilities.BaseEntities;

namespace JobLink_Backend.Entities;

public class Message : BaseEntity<Guid>
{
    public string Content { get; set; }
    public DateTime SentAt { get; set; }


    // Foreign Keys
    public Guid SenderId { get; set; }
    public User Sender { get; set; }

    public Guid ConversationId { get; set; }
    public Conversation Conversation { get; set; }
}