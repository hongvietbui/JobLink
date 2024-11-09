using JobLink_Backend.Entities;

namespace JobLink_Backend.DTOs.Request.SupportRequests;

public class SupportFilterDto
{
    public string? Query { get; set; }
    public SupportRequestStatus? Status { get; set; }
    public SupportPriority? Priority { get; set; }
   public SupportCategory? Category { get; set; }
}