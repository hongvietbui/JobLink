using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers;

public class JobController(IJobService jobService) : BaseController
{
    private readonly IJobService _jobService = jobService;
    
    [HttpGet("id")]
    public async Task<IActionResult> GetJobById([FromQuery] Guid jobId)
    {
        var job = await _jobService.GetJobByIdAsync(jobId);
        return Ok(new ApiResponse<JobDTO>
        {
            Data = job,
            Message = "Get job details successfully!",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        });
    }
}