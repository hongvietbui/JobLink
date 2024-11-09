namespace JobLink_Backend.DTOs.All;

public class ConversationDto
{
    public Guid JobId { get; set; }

    public Guid JobOwnerId { get; set; }

    public Guid WorkerId { get; set; }
}