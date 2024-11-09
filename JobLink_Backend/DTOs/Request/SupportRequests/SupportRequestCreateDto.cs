using JobLink_Backend.Entities;

namespace JobLink_Backend.DTOs.Request.SupportRequests;

public class SupportRequestCreateDto
{
    public String Title { get; set; }
    public String Description { get; set; }
    public SupportPriority Priority { get; set; }
    public SupportCategory Category { get; set; }
    public Guid? JobId { get; set; }
    public IFormFile? Attachment  { get; set; }
}