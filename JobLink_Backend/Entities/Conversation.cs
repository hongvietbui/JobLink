using JobLink_Backend.Utilities.BaseEntities;

namespace JobLink_Backend.Entities;

public class Conversation : BaseEntity<Guid>
{
    public Guid JobId { get; set; }
    public Job Job { get; set; }
    public Guid JobOwnerId  { get; set; }
    public JobOwner JobOwner { get; set; }
    public Guid WorkerId { get; set; }
    public Worker Worker { get; set; }
    
    
    public List<Message> Messages { get; set; } = new List<Message>();
}