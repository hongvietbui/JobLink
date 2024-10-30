using JobLink_Backend.Entities;
using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace JobLink_Backend.DTOs.All;

public class JobDTO
{
    public Guid Id { get; set; }
    public string? Name { get; set; }

    public string? Description { get; set; }
    public decimal? Price { get; set; }
    public Guid? OwnerId { get; set; }
    public string? Address { get; set; }
    public int? Lat { get; set; }
    public int? Lon { get; set; }
    public string? Status { get; set; }
    public Duration? Duration { get; set; }
    public string? Avatar { get; set; }

}
