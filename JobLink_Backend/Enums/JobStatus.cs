using JobLink_Backend.Utilities;

namespace JobLink_Backend.Entities;

public enum JobStatus
{
    [StringValue("PENDING_APPROVAL")]
    PENDING_APPROVAL,
    [StringValue("APPROVED")]
    APPROVED,
    [StringValue("REJECTED")]
    REJECTED,
    [StringValue("EXPIRED")]
    EXPIRED,
    [StringValue("DELETED")]
    DELETED,
    [StringValue("COMPLETED")]
    COMPLETED,
    [StringValue("IN_PROGRESS")]
    IN_PROGRESS
}