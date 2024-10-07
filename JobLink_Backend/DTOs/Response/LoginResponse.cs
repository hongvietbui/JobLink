namespace JobLink_Backend.DTOs.Response;

public class LoginResponse
{
    public string AccessToken { get; set; }
    public string RefreshToken { get; set; }
}