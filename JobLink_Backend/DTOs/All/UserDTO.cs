using JobLink_Backend.Entities;

namespace JobLink_Backend.DTOs.All;

public class UserDTO
{
    public Guid Id { get; set; }
    public string Username { get; set; }
    public decimal? AccountBalance { get; set; }
    public string? Password { get; set; }
    public string Email { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string PhoneNumber { get; set; }
    public DateOnly? DateOfBirth { get; set; }
    public string? Address { get; set; }
    public int? Lat { get; set; }
    public int? Lon { get; set; }
    public string? Avatar { get; set; }
    public Guid RoleId { get; set; }
    public string? RefreshToken { get; set; }
    public DateTime? RefreshTokenExpiryTime { get; set; }
    public string? Status { get; set; }
    public List<string> RoleList { get; set; }
}