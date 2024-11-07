using JobLink_Backend.Entities;

namespace JobLink_Backend.DTOs.Request.Jobs;

public class JobListRequestDto : PagingFilterBase
{
    public string? Query { get; set; }
    public bool? IsOwner { get; set; }
    public JobStatus? Status { get; set; }
}