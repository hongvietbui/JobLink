using JobLink_Backend.Entities;

namespace JobLink_Backend.DTOs.Request.Supports;

public class SupportFilterDTO
{
    public string Title { get; set; }
    public string Description { get; set; }
    public Guid UserId { get; set; }
    public SupportCategory Category { get; set; }
    public SupportPriority Priority { get; set; }
    public SupportRequestStatus Status { get; set; }
    public string? Image { get; set; }
}