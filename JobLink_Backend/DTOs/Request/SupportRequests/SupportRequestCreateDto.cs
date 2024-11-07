using JobLink_Backend.Entities;

namespace JobLink_Backend.DTOs.Request.SupportRequests;

public class SupportRequestCreateDto
{
    public String Title { get; set; }
    public String Descrtiption { get; set; }
    public SupportPriority Priority { get; set; }
    public SupportCategory Category { get; set; }
    public Fil Type { get; set; }
}