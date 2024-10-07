using JobLink_Backend.Utilities;

namespace JobLink_Backend.Entities;

public enum JobStatus
{
    [StringValue("pending-approval")]
    PendingApproval,
    [StringValue("approved")]
    Approved,
    [StringValue("rejected")]
    Rejected,
    [StringValue("expired")]
    Expired,
    [StringValue("deleted")]
    Deleted,
    [StringValue("completed")]
    Completed,
    [StringValue("in-progress")]
    InProgress
}