using JobLink_Backend.Utilities;

namespace JobLink_Backend.Entities;

public enum NationalIdStatus
{
    [StringValue("PENDING")]
    Pending,
    [StringValue("REJECTED")]
    Rejected,
    [StringValue("APPROVED")]
    Approved
}