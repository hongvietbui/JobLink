using JobLink_Backend.Entities;
using System.ComponentModel.DataAnnotations;
using System.Diagnostics.CodeAnalysis;

namespace JobLink_Backend.DTOs.All.Job
{
    public class CreateJobDto
    {
        public string Name { get; set; }
        public string Description { get; set; }
        public string Address { get; set; }
        public int? Lat { get; set; }
        public int? Lon { get; set; }
        public JobStatus Status { get; set; }
    }
}
