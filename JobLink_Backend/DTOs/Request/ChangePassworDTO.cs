namespace JobLink_Backend.DTOs.Request;

public class ChangePassworDTO
{
    public Guid UserId { get; set; }
    public string CurrentPassword { get; set; }
    public string NewPassword { get; set; }
}