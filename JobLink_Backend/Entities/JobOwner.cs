using System.ComponentModel.DataAnnotations;
using JobLink_Backend.Utilities.BaseEntities;

namespace JobLink_Backend.Entities;

public class JobOwner : BaseEntity<Guid>
{
    [Required]
    public Guid UserId { get; set; }
    
    public float? Rating { get; set; }
    public User User { get; set; }
    public ICollection<Job> OwnedJobs { get; set; } = new List<Job>();
    public ICollection<Review> OwnerReviews { get; set; } = new List<Review>();
}