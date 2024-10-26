using JobLink_Backend.Entities;

namespace JobLink_Backend.DTOs.Request.Jobs;

public class JobListRequestDTO
{
    public string? Filter { get; set; }
    public bool? IsOwner { get; set; }
    public JobStatus? Status { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}