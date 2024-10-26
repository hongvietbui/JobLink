using JobLink_Backend.Utilities;

namespace JobLink_Backend.Entities;

public enum PaymentStatus
{
    [StringValue("Pending")]
    Pending,
    [StringValue("Done")]
    Done,
    [StringValue("Rejected")]
    Rejected
}