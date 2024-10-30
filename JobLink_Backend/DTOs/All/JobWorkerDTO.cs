using JobLink_Backend.Entities;

namespace JobLink_Backend.DTOs.All
{
    public class JobWorkerDTO
    {
        public Guid JobId { get; set; }
        public Guid WorkerId { get; set; }
        public string ApplyStatus { get; set; }
    }
}
