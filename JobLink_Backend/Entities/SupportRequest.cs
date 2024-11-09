using JobLink_Backend.Utilities.BaseEntities;

namespace JobLink_Backend.Entities;

public class SupportRequest: BaseEntity<Guid>
{
    public string Title { get; set; }
    public string Description { get; set; }
    public Guid UserId { get; set; }
    public SupportCategory Category{ get; set; }
    public SupportPriority Priority { get; set; }
    public SupportRequestStatus Status { get; set; }
    public string? Attachment { get; set; }
    public Guid? JobId { get; set; }
    public User User { get; set; }
    public Job? Job { get; set; }
}