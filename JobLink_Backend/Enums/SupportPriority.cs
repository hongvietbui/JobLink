using JobLink_Backend.Utilities;

namespace JobLink_Backend.Entities;

public enum SupportPriority
{
    [StringValue("High")]
    High,
    [StringValue("Medium")]
    Medium,
    [StringValue("Low")]
    Low,
}