
using JobLink_Backend.Entities;

namespace JobLink_Backend.DTOs.All;

public class SupportRequestDto
{
    public Guid Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public SupportCategory Category{ get; set; }
    public SupportPriority Priority { get; set; }
    public SupportRequestStatus Status { get; set; }
    public string? Attachment { get; set; }
    public UserDTO? User { get; set; }
    public Entities.Job? Job { get; set; }
}