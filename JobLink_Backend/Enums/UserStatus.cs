using JobLink_Backend.Utilities;

namespace JobLink_Backend.Entities;

public enum UserStatus
{
    [StringValue("ACTIVE")]
    Active,
    [StringValue("PENDING_VERIFICATION")]
    PendingVerification,
    [StringValue("SUSPENDED")]
    Suspended,
    [StringValue("LOCKED")]
    Locked
}