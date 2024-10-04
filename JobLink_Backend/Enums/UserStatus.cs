using JobLink_Backend.Utilities;

namespace JobLink_Backend.Entities;

public enum UserStatus
{
    [StringValue("active")]
    Active,
    [StringValue("pending-verification")]
    PendingVerification,
    [StringValue("suspended")]
    Suspended,
    [StringValue("locked")]
    Locked
}