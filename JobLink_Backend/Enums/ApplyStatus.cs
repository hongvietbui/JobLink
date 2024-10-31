using JobLink_Backend.Utilities;

namespace JobLink_Backend.Entities;

public enum ApplyStatus
{
    [StringValue("PENDING")]
    Pending,
    [StringValue("ACCEPTED")]
    Accepted,
    [StringValue("REJECTED")]
    Rejected,
    [StringValue("DONE")]
    Done
}