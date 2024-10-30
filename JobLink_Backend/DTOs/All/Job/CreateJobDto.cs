using JobLink_Backend.Entities;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Diagnostics.CodeAnalysis;

namespace JobLink_Backend.DTOs.All.Job
{
    public class CreateJobDto
    {
        public string Name { get; set; } = string.Empty;
        public string Description { get; set; } = string.Empty;
        public string Address { get; set; } = string.Empty;
        public int? Lat { get; set; }
        public int? Lon { get; set; }
        public JobStatus Status { get; set; }
        public Duration? Duration { get; set; }
        public decimal? Price { get; set; }
        public string Avatar { get; set; } = string.Empty;
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
    }
}
