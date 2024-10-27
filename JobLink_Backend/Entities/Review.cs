using JobLink_Backend.Utilities.BaseEntities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobLink_Backend.Entities
{
    public class Review: BaseEntity<Guid>
    {
        public Guid JobId { get; set; }
        public Guid? WorkerId { get; set; }
        public Guid? OwnerId { get; set; }
        public float? WorkerRating { get; set; }
        public float? OwnerRating { get; set; }
        public string? WorkerComment { get; set; }
        public string? OwnerComment { get; set; }

        public DateTime? WorkerRatingDate { get; set; }
        public DateTime? OwnerRatingDate { get; set; }

        // Navigation properties
        public Worker Worker { get; set; }
        public JobOwner Owner { get; set; }
        public Job Job { get; set; }
    }
}
