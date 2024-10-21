using JobLink_Backend.Utilities;

namespace JobLink_Backend.Entities;

public enum JobStatus
{
    [StringValue("PENDING_APPROVAL")]
    PendingApproval,
    [StringValue("APPROVED")]
    Approved,
    [StringValue("REJECTED")]
    Rejected,
    [StringValue("EXPIRED")]
    Expired,
    [StringValue("DELETED")]
    Deleted,
    [StringValue("COMPLETED")]
    Completed,
    [StringValue("IN_PROGRESS")]
    InProgress
}