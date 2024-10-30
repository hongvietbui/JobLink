using JobLink_Backend.DTOs.All.Job;
using JobLink_Backend.DTOs.Request;
using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request.Jobs;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.DTOs.Response.Jobs;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities.Pagination;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using JobLink_Backend.Utilities.Pagination;
using JobLink_Backend.Entities;
using System.Linq.Expressions;
using Microsoft.AspNetCore.Authorization;

namespace JobLink_Backend.Controllers;

[AllowAnonymous]
public class JobController(IJobService jobService, IMapper mapper) : BaseController
{
    private readonly IJobService _jobService = jobService;
    private readonly IMapper _mapper = mapper;
    
    [HttpGet("id")]
    public async Task<IActionResult> GetJobById([FromQuery] Guid jobId)
    {
        var job = await _jobService.GetJobByIdAsync(jobId);
        
        if(job == null)
            return NotFound(new ApiResponse<JobDTO>
            {
                Data = null,
                Message = "Job not found",
                Status = 404,
                Timestamp = DateTime.Now.Ticks
            });
        
        return Ok(new ApiResponse<JobDTO>
        {
            Data = job,
            Message = "Get job details successfully!",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        });
    }
    
    [HttpGet("role")]
    public async Task<IActionResult> GetRoleByJobId([FromQuery] Guid jobId, [FromHeader] string authorization)
    {
        var accessToken = authorization.Split(" ")[1];
        
        var role = await _jobService.GetUserRoleInJobAsync(jobId, accessToken);

        if (role == null)
            return NotFound(new ApiResponse<RoleDTO>
            {
                Data = null,
                Message = "User role not found",
                Status = 404,
                Timestamp = DateTime.Now.Ticks
            });
        
        return Ok(new ApiResponse<RoleDTO>
        {
            Data = _mapper.Map<RoleDTO>(role),
            Message = "Get user role in job successfully!",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        });
    }
    [AllowAnonymous]
    [HttpGet("get-jobs")]
        public async Task<IActionResult> GetJobsAsync(int pageIndex = 1, int pageSize = 10, string sortBy = null, bool isDescending = false, string filter = null)
        {
            try
            {
                Expression<Func<Job, bool>> filterExpression = null;

                if (!string.IsNullOrEmpty(filter))
                {
                    filterExpression = job => job.Name.Contains(filter) || job.Description.Contains(filter);
                }

               
                var result = await _jobService.GetJobsAsync(pageIndex, pageSize, sortBy, isDescending, filterExpression);

                if (result == null || result.TotalItems == 0)
                {
                    return BadRequest(new ApiResponse<string>
                    {
                        Data = null,
                        Message = "No jobs found",
                        Status = 404,
                        Timestamp = DateTime.Now.Ticks
                    });
                }

                var viewJobResponse = new ApiResponse<Pagination<JobDTO>>
                {
                    Data = result, 
                    Message = "Jobs retrieved successfully",
                    Status = 200,
                    Timestamp = DateTime.Now.Ticks
                };

                return Ok(viewJobResponse);
            }
            catch (Exception ex)
            {
                return BadRequest(new ApiResponse<string>
                {
                    Data = null,
                    Message = ex.Message,
                    Status = 500,
                    Timestamp = DateTime.Now.Ticks
                });
            }
        }
/*    [HttpPost("create-job")]
    public async Task<IActionResult> CreateJob([FromBody] ApiRequest<CreateJobDto> createJobDto)
    {
        var result = await _userService.AddUserAsync(createJobDto.Data);
        return CreatedAtAction(nameof(GetJobById), new { id = result.Id }, 
            new ApiResp<JobDTO>(201, "Job created", result));
    }*/

    [HttpGet]
   public async Task<IActionResult> GetAll([FromQuery] JobListRequestDTO filter, [FromHeader] string authorization)
   {
       var accessToken = authorization.Split(" ")[1];

       var jobsList = await _jobService.GetAllJobsDashboardAsync(filter, accessToken); 
       if (jobsList == null)
           return NotFound(new ApiResponse<JobDTO>
           {
               Data = null,
               Message = "User role not found",
               Status = 404,
               Timestamp = DateTime.Now.Ticks
           });
        
       return Ok(new ApiResponse<Pagination<JobDTO>>
       {
           Data = jobsList,
           Message = "Get user role in job successfully!",
           Status = 200,
           Timestamp = DateTime.Now.Ticks
       });
   }
    [AllowAnonymous]
    [HttpGet("created-by-user")]
    public async Task<IActionResult> GetJobsCreatedByUserAsync([FromHeader] string authorization , int pageIndex = 1, int pageSize = 10, string sortBy = null, bool isDescending = false)
    {
        string accessToken = string.Empty;

        if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer "))
        {
            accessToken = authorization.Split(" ")[1];
        }
        else
        {
            return BadRequest(new ApiResponse<string>
            {
                Data = null,
                Message = "Invalid authorization format.",
                Status = 400,
                Timestamp = DateTime.Now.Ticks
            });
        }

        try
        {
            var result = await _jobService.GetJobsCreatedByUserAsync(pageIndex, pageSize, sortBy, isDescending, accessToken);

            if (result == null || result.Items == null || result.Items.Count == 0)
            {
                return NotFound(new ApiResponse<string>
                {
                    Data = null,
                    Message = "No jobs applied by the user found.",
                    Status = 404,
                    Timestamp = DateTime.Now.Ticks
                });
            }

            return Ok(new ApiResponse<Pagination<JobDTO>>
            {
                Data = result,
                Message = "Jobs applied by the user retrieved successfully!",
                Status = 200,
                Timestamp = DateTime.Now.Ticks
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>
            {
                Data = null,
                Message = ex.Message,
                Status = 500,
                Timestamp = DateTime.Now.Ticks
            });
        }
    }

    [HttpGet("applied-by-user")]
    public async Task<IActionResult> GetJobsAppliedByUserAsync([FromHeader] string authorization, int pageIndex = 1, int pageSize = 10, string sortBy = null, bool isDescending = false)
    {
        string accessToken = string.Empty;

        if (!string.IsNullOrEmpty(authorization) && authorization.StartsWith("Bearer "))
        {
            accessToken = authorization.Split(" ")[1];
        }
        else
        {
            return BadRequest(new ApiResponse<string>
            {
                Data = null,
                Message = "Invalid authorization format.",
                Status = 400,
                Timestamp = DateTime.Now.Ticks
            });
        }

        try
        {
            var result = await _jobService.GetJobsAppliedByUserAsync(pageIndex, pageSize, sortBy, isDescending, accessToken);

            if (result == null || result.Items == null || result.Items.Count == 0)
            {
                return NotFound(new ApiResponse<string>
                {
                    Data = null,
                    Message = "No jobs applied by the user found.",
                    Status = 404,
                    Timestamp = DateTime.Now.Ticks
                });
            }

            return Ok(new ApiResponse<Pagination<JobDTO>>
            {
                Data = result,
                Message = "Jobs applied by the user retrieved successfully!",
                Status = 200,
                Timestamp = DateTime.Now.Ticks
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>
            {
                Data = null,
                Message = ex.Message,
                Status = 500,
                Timestamp = DateTime.Now.Ticks
            });
        }
    }


    [HttpGet("apply-job/{jobId}")]
    public async Task<IActionResult> GetApplicantsByJobId([FromRoute] Guid jobId)
    {
        var applicants = await _jobService.GetApplicantsByJobIdAsync(jobId);
        if (applicants == null || !applicants.Any())
            return NotFound(new ApiResponse<UserDTO>
            {
                Data = null,
                Message = "No applicants found for this job",
                Status = 404,
                Timestamp = DateTime.Now.Ticks
            });

        return Ok(new ApiResponse<List<UserDTO>>
        {
            Data = applicants,
            Message = "Applicants retrieved successfully!",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        });
    }
    [HttpGet("statistical")]
   public async Task<IActionResult> GetAll([FromQuery] JobStatisticalDto filter, [FromHeader] string authorization)
   {
       var accessToken = authorization.Split(" ")[1];

       var jobsList = await _jobService.GetJobStatisticalAsync(filter, accessToken); 
       if (jobsList == null)
           return NotFound(new ApiResponse<List<JobStatisticalResponseDto>>
           {
               Data = null,
               Message = "User role not found",
               Status = 404,
               Timestamp = DateTime.Now.Ticks
           });
        
       return Ok(new ApiResponse<List<JobStatisticalResponseDto>>
       {
           Data = jobsList,
           Message = "Get user role in job successfully!",
           Status = 200,
           Timestamp = DateTime.Now.Ticks
       });
   }
}
