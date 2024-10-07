using System.ComponentModel.DataAnnotations;
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
    [AllowNull]
    public Guid WorkerId { get; set; }
    public string Address { get; set; }
    public int? Lat { get; set; }
    public int? Lon { get; set; }
    public JobStatus Status { get; set; }

    public User Owner { get; set; }
    public User Worker { get; set; }
}