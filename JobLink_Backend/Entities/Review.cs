using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace JobLink_Backend.Entities
{
    public class Review
    {
        [Key]
        public int Id { get; set; }
        public int JobId { get; set; }
        public int? WorkerId { get; set; }
        public int? OwnerId { get; set; }
        public float? WorkerRating { get; set; }
        public float? OwnerRating { get; set; }
        public string WorkerComment { get; set; }
        public string OwnerComment { get; set; }
        public DateTime? WorkerRatingDate { get; set; }
        public DateTime? OwnerRatingDate { get; set; }

        [ForeignKey(nameof(WorkerId))]
        public required User Worker { get; set; }
        [ForeignKey(nameof(OwnerId))]
        public required User Owner { get; set; }

        [ForeignKey(nameof(JobId))]
        public required Job Job { get; set; }
    }
}
