using JobLink_Backend.Entities;

namespace JobLink_Backend.DTOs.All;

public class JobDTO
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? Description { get; set; }
    public Guid? OwnerId { get; set; }
    public Guid? WorkerId { get; set; }
    public string? Address { get; set; }
    public int? Lat { get; set; }
    public int? Lon { get; set; }
    public double? Duration { get; set; }
    public decimal? Price { get; set; }
    public string? Status { get; set; }
}
