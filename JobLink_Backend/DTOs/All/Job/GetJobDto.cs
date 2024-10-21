using JobLink_Backend.Entities;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace JobLink_Backend.DTOs.All.Job
{
    public class GetJobDto
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
    }
}
