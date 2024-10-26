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
                {
                    await _userService.AddNotificationAsync(changePassword.Data.UserId, "Your password has been changed!!");
                    return Ok(new { message = "Change password successfully" });
                }
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
            if (notifications == null || !notifications.Any())
            {
                return NotFound(new { message = "No notifications found for this user." });
            }
            return Ok(notifications);
        }

        [HttpGet("topupHistory")]
        public async Task<IActionResult> GetTopUpHistory([FromQuery] TransactionsRequest request)
        {
            try
            {
                var transactions = await _userService.GetTransactionsAsync(request);

                if (transactions == null || !transactions.Any())
                {
                    return NotFound(new { message = "No transactions found for this user." });
                }

                return Ok(transactions);
                }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
        
        [HttpGet("me")]
        public async Task<IActionResult> GetCurrentUser([FromHeader] String authorization)
        {
            var accessToken = authorization.Split(" ")[1];
            return Ok(new ApiResponse<UserDTO>
            {
                Data = await _userService.GetUserByAccessToken(accessToken),
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

        [HttpGet("pending-national-ids")]
        [AllowAnonymous]
        public async Task<IActionResult> GetPendingNationalIds()
        {
            var pendingNationalIds = await _userService.GetPendingNationalIdsAsync();
            if (pendingNationalIds == null || !pendingNationalIds.Any())
            {
                return NotFound(new { message = "No pending national IDs found." });
            }
            return Ok(new ApiResponse<List<UserNationalIdDTO>>
            {
                Data = pendingNationalIds,
                Message = "Fetched pending national IDs successfully.",
                Status = 200,
                Timestamp = DateTime.Now.Ticks
            });
        }

        [HttpGet("national-id/{userId}")]
        [AllowAnonymous]

        public async Task<IActionResult> GetNationalIdDetail(Guid userId)
        {
            try
            {
                var nationalIdDetail = await _userService.GetNationalIdDetailAsync(userId);
                return Ok(new ApiResponse<UserNationalIdDTO>
                {
                    Data = nationalIdDetail,
                    Message = "Get national ID detail successfully!",
                    Status = 200,
                    Timestamp = DateTime.Now.Ticks
                });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("national-id/{userId}/approve")]
        [AllowAnonymous]

        public async Task<IActionResult> ApproveNationalId(Guid userId)
        {
            try
            {
                var result = await _userService.ApproveNationalIdAsync(userId);
                if (result)
                {
                    return Ok(new { message = "National ID approved successfully" });
                }
                return BadRequest(new { message = "Failed to approve National ID" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [HttpPost("national-id/{userId}/reject")]
        [AllowAnonymous]

        public async Task<IActionResult> RejectNationalId(Guid userId)
        {
            try
            {
                var result = await _userService.RejectNationalIdAsync(userId);
                if (result)
                {
                    return Ok(new { message = "National ID rejected successfully" });
                }
                return BadRequest(new { message = "Failed to reject National ID" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}