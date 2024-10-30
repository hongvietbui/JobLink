using JobLink_Backend.Utilities.BaseEntities;

namespace JobLink_Backend.Entities;

public class JobWorker
{
    public Guid JobId { get; set; }
    public Guid WorkerId { get; set; }
    public ApplyStatus ApplyStatus { get; set; }
    public Job Job { get; set; }
    public Worker Worker { get; set; }
}