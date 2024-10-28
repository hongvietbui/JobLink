namespace JobLink_Backend.DTOs.Request;

public class ChangePassworDTO
{
    public string Username { get; set; }
    public string CurrentPassword { get; set; }
    public string NewPassword { get; set; }
}