using System.ComponentModel.DataAnnotations;
using JobLink_Backend.Utilities.BaseEntities;
using Microsoft.EntityFrameworkCore;

namespace JobLink_Backend.Entities;

public class Worker : BaseEntity<Guid>
{
    
    [Required]
    public Guid UserId { get; set; }
    
    public float? Rating { get; set; }
    public User User { get; set; }

    public ICollection<JobWorker> JobWorkers { get; set; } = new List<JobWorker>();
    public ICollection<Review> WorkerReviews { get; set; } = new List<Review>();
    public List<Conversation> WorkerConversations { get; set; }
}