using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.DTOs.Response.Users;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers
{
    public class UserController : BaseController
    {
        private readonly IUserService _userService;
        private readonly JwtService _jwtService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword([FromBody] ApiRequest<ChangePassworDTO> changePassword)
        {
            try
            {
                var result = await _userService.ChangePassword(changePassword.Data);
                if (true)
                    return Ok(new { message = "Change password successfully" });
                else
                    return BadRequest(new { message = "Change password failed" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpGet("{userId}/notifications")]
        public async Task<IActionResult> GetUserNotifications(Guid userId)
        {
            var notifications = await _userService.GetUserNotificationsAsync(userId);
            return Ok(notifications);
        }
        
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser([FromHeader] String authorization)
        {
            var accessToken = authorization.Split(" ")[1];
            var user = await _userService.GetUserByAccessToken(accessToken);
            return Ok(new ApiResponse<UserDTO>
            {
                Data = user,
                Message = "Get user details successfully!",
                Status = 200,
                Timestamp = DateTime.Now.Ticks
            });
        }

        [HttpGet("homepage")]
        public async Task<IActionResult> GetUserData([FromHeader] string authorization)
        {
            var accessToken = authorization.Split(" ")[1];

            try
            {
                var userData = await _userService.GetUserHompageAsync(accessToken);
                return Ok(new ApiResponse<UserHompageDTO>
                {
                    Data = userData,
                    Message = "Get data successfully!",
                    Status = 200,
                    Timestamp = DateTime.Now.Ticks
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}