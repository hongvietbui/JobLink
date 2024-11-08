using JobLink_Backend.Utilities;

namespace JobLink_Backend.Entities;

public enum SupportRequestStatus
{
    [StringValue("Open")]
    Open,
    [StringValue("Done")]
    Done,
    [StringValue("In-progress")]
    InProgress,
}