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
using System.Net;
using Microsoft.AspNetCore.Http.HttpResults;

namespace JobLink_Backend.Controllers;

[AllowAnonymous]
public class JobController(IJobService jobService, IMapper mapper, INotificationService notificationService, IUserService userService) : BaseController
{
    private readonly IJobService _jobService = jobService;
    private readonly IMapper _mapper = mapper;
    private readonly INotificationService _notificationService = notificationService;
    private readonly IUserService _userService = userService;
    
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
        
        return Ok(new ApiResponse<string>
        {
            Data = role,
            Message = "Get user role in job successfully!",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        });
    }
   
    [HttpGet("all")]
        public async Task<IActionResult> GetJobsAsync(int pageIndex = 1, int pageSize = 10, string sortBy = null, bool isDescending = false, string filter = null)
        {
            try
            {
       //     var accessToken = authorization.Split(" ")[1];
            Expression<Func<Job, bool>> filterExpression = null;

                if (!string.IsNullOrEmpty(filter))
                {
                    filterExpression = job => job.Name.Contains(filter) || job.Description.Contains(filter);
                }

               
                var result = await _jobService.GetJobsAsync(pageIndex, pageSize, sortBy, isDescending, filterExpression);

                if (result == null || result.TotalItems == 0)
                {
                    return Ok(
                        new ApiResponse<Pagination<JobDTO>>
                        {
                            Data = null,
                            Message = "No jobs found",
                            Status = 204,
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
                    Status = 400,
                    Timestamp = DateTime.Now.Ticks
                });
            }
        }
        
    [HttpPost]
    public async Task<IActionResult> CreateJob([FromBody] ApiRequest<CreateJobDto> createJobDto, [FromHeader] string authorization)
    {
        string accessToken = authorization.Split(" ")[1];
        try
        {
            // Kiểm tra số dư trước khi tạo job
            bool hasEnoughBalance = await _jobService.CheckUserBalanceAsync(accessToken,createJobDto.Data.Price);

            if (!hasEnoughBalance)
            {
                return StatusCode(402, new ApiResponse<JobDTO>
                {
                    Data = null,
                    Message = "Insufficient funds. Please recharge your account.",
                    Status = 402, // HTTP 402 Payment Required
                    Timestamp = DateTime.Now.Ticks
                });
            }

            var result = await _jobService.AddJobAsync(createJobDto.Data, accessToken);
            return CreatedAtAction(nameof(GetJobById), new { id = result.Id }, new ApiResp<JobDTO>(201, "Job created", result));
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<JobDTO>
            {
                Data = null,
                Message = ex.Message,
                Status = 500,
                Timestamp = DateTime.Now.Ticks
            });
        }
    }



    [HttpGet]
   public async Task<IActionResult> GetAll([FromQuery] JobListRequestDto filter, [FromHeader] string authorization)
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
    
   [HttpGet("user")]
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
                return Ok(new ApiResponse<string>
                {
                    Data = null,
                    Message = "No jobs create by user found.",
                    Status = 204,
                    Timestamp = DateTime.Now.Ticks
                });
            }

            return Ok(new ApiResponse<Pagination<JobDTO>>
            {
                Data = result,
                Message = "Jobs created by the user retrieved successfully!",
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
    
    [HttpGet("applied")]
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
                return Ok(new ApiResponse<string>
                {
                    Data = null,
                    Message = "No jobs applied by the user found.",
                    Status = 204,
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
                Status = 400,
                Timestamp = DateTime.Now.Ticks
            });
        }
    }


    [HttpGet("applied-workers/{jobId}")]
    public async Task<IActionResult> GetApplicantsByJobId([FromRoute] Guid jobId)
    {
        var applicants = await _jobService.GetApplicantsByJobIdAsync(jobId);
        if (applicants == null || !applicants.Any())
            return Ok(new ApiResponse<UserDTO>
            {
                Data = null,
                Message = "No applicants found for this job",
                Status = 204,
                Timestamp = DateTime.Now.Ticks
            });

        return Ok(new ApiResponse<List<UserWithWorkerIdDTO>>
        {
            Data = applicants,
            Message = "Applicants retrieved successfully!",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        });
    }
    
    [HttpGet("stats")]
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


    [HttpGet("applied-workers")]
    public async Task<IActionResult> GetAppliedWorkersByJobId([FromQuery] Guid jobId, [FromHeader] string authorization)
    {
        // Lấy access token từ header Authorization
        var accessToken = authorization.Split(" ")[1];

        try
        {
            // Lấy danh sách JobWorkers đã apply vào job nếu user có quyền truy cập
            var appliedWorkers = await _jobService.GetJobWorkersApplyAsync(jobId, accessToken);

            // Nếu không có worker nào apply, trả về thông báo không tìm thấy
            if (appliedWorkers == null || !appliedWorkers.Any())
            {
                return Ok(new ApiResponse<List<JobWorkerDTO>>
                {
                    Data = null,
                    Message = "No applied workers found for this job",
                    Status = 204,
                    Timestamp = DateTime.Now.Ticks
                });
            }
            

            return Ok(new ApiResponse<List<JobWorkerDTO>>
            {
                Data = appliedWorkers,
                Message = "Get applied workers successfully",
                Status = 200,
                Timestamp = DateTime.Now.Ticks
            });
        }
        catch (UnauthorizedAccessException ex)
        {
            // Trả về lỗi nếu user không có quyền truy cập
            return Unauthorized(new ApiResponse<string>
            {
                Data = null,
                Message = ex.Message,
                Status = 401,
                Timestamp = DateTime.Now.Ticks
            });
        }
        catch (Exception ex)
        {
            // Trả về lỗi nếu có lỗi khác xảy ra
            return StatusCode(500, new ApiResponse<string>
            {
                Data = null,
                Message = $"An error occurred: {ex.Message}",
                Status = 500,
                Timestamp = DateTime.Now.Ticks
            });
        }
    }

              
    [HttpGet("job-owner/{jobId}")]
    public async Task<IActionResult> GetJobAndOwnerDetails([FromRoute] Guid jobId)
    {
        var jobAndOwnerDetails = await _jobService.GetJobAndOwnerDetailsAsync(jobId);

        if (jobAndOwnerDetails == null)
            return NotFound(new ApiResponse<JobAndOwnerDetailsResponse>
            {
                Data = null,
                Message = "Job or owner not found",
                Status = 404,
                Timestamp = DateTime.Now.Ticks
            });

        return Ok(new ApiResponse<JobAndOwnerDetailsResponse>
        {
            Data = jobAndOwnerDetails,
            Message = "Job and owner details retrieved successfully!",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        });
    }

    [HttpPatch("assign/{jobId}")]
    public async Task<IActionResult> AssignJob([FromHeader] string authorization, string jobId)
    {
        try
        {
            var jobIdGuid = Guid.Parse(jobId);
            var accessToken = authorization.Split(" ")[1];
            await _jobService.AssignJobAsync(jobIdGuid, accessToken);
            return Ok(new ApiResponse<string>
            {
                Data = null,
                Message = "Job assign successfully",
                Status = 200,
                Timestamp = DateTime.Now.Ticks
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>()
            {
                Data = null,
                Message = ex.Message,
                Status = 400,
                Timestamp = DateTime.Now.Ticks
            });
        }
    }
    
    [HttpPatch("accept/{jobId}/{workerId}")]
    public async Task<IActionResult> AcceptWorker([FromHeader] string authorization, string jobId, string workerId)
    {
        try
        {
            var jobIdGuid = Guid.Parse(jobId);
            var WorkerId = Guid.Parse(workerId);
            
            var accessToken = authorization.Split(" ")[1];
            await _jobService.AcceptWorkerAsync(jobIdGuid, WorkerId, accessToken);
            return Ok(new ApiResponse<string>
            {
                Data = null,
                Message = "Worker accept successfully",
                Status = 200,
                Timestamp = DateTime.Now.Ticks
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>()
            {
                Data = null,
                Message = ex.Message,
                Status = 400,
                Timestamp = DateTime.Now.Ticks
            });
        }
    }
    
    [HttpPatch("complete/{jobId}")]
    public async Task<IActionResult> CompleteJob([FromHeader] string authorization, string jobId)
    {
        try
        {
            var jobIdGuid = Guid.Parse(jobId);

            var accessToken = authorization.Split(" ")[1];
            await _jobService.CompleteJobAsync(jobIdGuid, accessToken);

            return Ok(new ApiResponse<string>
            {
                Data = null,
                Message = "Job completed and worker status updated successfully",
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
                Status = 400,
                Timestamp = DateTime.Now.Ticks
            });
        }
    }


    [HttpPatch("reject/{jobId}/{workerId}")]
    public async Task<IActionResult> RejectWorker([FromHeader] string authorization, string jobId, string workerId)
    {
        try
        {
            var jobIdGuid = Guid.Parse(jobId);
            var workerIdGuid = Guid.Parse(workerId);

            var accessToken = authorization.Split(" ")[1];
            await _jobService.RejectWorkerAsync(jobIdGuid, workerIdGuid, accessToken);
            return Ok(new ApiResponse<string>
            {
                Data = null,
                Message = "Worker reject successfully",
                Status = 200,
                Timestamp = DateTime.Now.Ticks
            });
        }
        catch (Exception ex)
        {
            return BadRequest(new ApiResponse<string>()
            {
                Data = null,
                Message = ex.Message,
                Status = 400,
                Timestamp = DateTime.Now.Ticks
            });
        }
    }
}
