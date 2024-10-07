using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;
using JobLink_Backend.Utilities.BaseEntities;

namespace JobLink_Backend.Entities;

public class User : BaseEntity<Guid>
{
    [Required]
    public string Username { get; set; }
    [Required]
    public string Password { get; set; }
    [Required]
    [EmailAddress]
    public string Email { get; set; }
    [MaxLength(50)]
    public string FirstName { get; set; }
    [MaxLength(50)]
    public string LastName { get; set; }
    [MaxLength(11)]
    [Phone]
    public string PhoneNumber { get; set; }
    public DateTime? DateOfBirth { get; set; }
    public string? Address { get; set; }
    public int? Lat { get; set; }
    public int? Lon { get; set; }
    public string? Avatar { get; set; }
    public Guid RoleId { get; set; }
    public string? RefreshToken { get; set; }
    public UserStatus Status { get; set; }
    
    //Navigation properties
    public Role Role { get; set; }
    public ICollection<Job> OwnedJobs { get; set; }
    public ICollection<Job> WorkedJobs { get; set; }
}