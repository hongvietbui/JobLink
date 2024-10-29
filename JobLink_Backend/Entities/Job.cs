using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;
using JobLink_Backend.Utilities.BaseEntities;

namespace JobLink_Backend.Entities;

public class Job : BaseEntity<Guid>
{
    [Required]
    public string Name { get; set; }
    [Required]
    public string Description { get; set; }

    [Required]
    public Guid OwnerId { get; set; }
    public string Address { get; set; }
    public int? Lat { get; set; }
    public int? Lon { get; set; }
    public JobStatus Status { get; set; }
    public double? Duration { get; set; } 
    [Column(TypeName = "decimal(18,2)")]
    public decimal? Price { get; set; }
    public string? Avatar {  get; set; }
    public JobOwner Owner { get; set; }
    public ICollection<JobWorker> JobWorkers { get; set; } = new List<JobWorker>();
    public ICollection<Review> Reviews { get; set; } = new List<Review>();
    public ICollection<SupportRequest> SupportRequests { get; set; }
}