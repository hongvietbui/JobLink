using JobLink_Backend.DTOs.All.Job;
using JobLink_Backend.DTOs.Request;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.Services.IServices;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers
{
    public class JobController : BaseController
    {
        [HttpPost("create-job")]
        public async Task<IActionResult> CreateUser([FromBody] ApiRequest<CreateJobDto> addUserDto)
        {
            var result = await _userService.AddUserAsync(addUserDto.Data);
            return CreatedAtAction(nameof(GetDetail), new { id = result.Id }, new ApiResponse<GetJobDto>(201, "User created", result));
        }
    }
}
