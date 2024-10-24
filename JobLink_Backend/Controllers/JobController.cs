using JobLink_Backend.DTOs.All.Job;
using JobLink_Backend.DTOs.Request;
﻿using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers;

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
   /* [HttpPost("create-job")]
    public async Task<IActionResult> CreateUser([FromBody] ApiRequest<CreateJobDto> addUserDto)
    {
        var result = await _userService.AddUserAsync(addUserDto.Data);
        return CreatedAtAction(nameof(GetDetail), new { id = result.Id }, new ApiResponse<GetJobDto>(201, "User created", result));
    }*/
}
