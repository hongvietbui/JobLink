using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.DTOs.Response.Transactions;
using JobLink_Backend.DTOs.Response.Users;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities;
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
        public async Task<IActionResult> ChangePassword([FromHeader] string authorization, [FromBody] ApiRequest<ChangePassworDTO> changePassword)
        {
            try
            {
                // Validate Authorization header and extract access token
                if (string.IsNullOrWhiteSpace(authorization) || !authorization.StartsWith("Bearer "))
                {
                    return Unauthorized(new ApiResponse<string>
                    {
                        Data = null,
                        Message = "Authorization header is missing or invalid.",
                        Status = 401,
                        Timestamp = DateTime.Now.Ticks
                    });
                }

                var accessToken = authorization.Split(" ")[1];
                var user = await _userService.GetUserByAccessToken(accessToken);

                // Check if the user in token matches the UserId in the changePassword data
                if (user == null || user.Id != changePassword.Data.UserId)
                {
                    return StatusCode(403, new ApiResponse<string>
                    {
                        Data = null,
                        Message = "Access denied.",
                        Status = 403,
                        Timestamp = DateTime.Now.Ticks
                    });
                }

                // Attempt password change and notify user
                var result = await _userService.ChangePassword(changePassword.Data);
                if (result)
                {
                    await _userService.AddNotificationAsync(user.Username, "Your password has been changed!!");
                    return Ok(new { message = "Password changed successfully" });
                }
                else
                {
                    return BadRequest(new { message = "Password change failed" });
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { message = $"An error occurred: {ex.Message}" });
            }
        }


        //mine
        //[HttpGet("{userId}/notifications")]
        [HttpGet("notifications/{username}")]
        
        [AllowAnonymous]
        public async Task<IActionResult> GetUserNotifications(string username)
        {
            var notifications = await _userService.GetUserNotificationsAsync(username);
            if (notifications == null || !notifications.Any())
            {
                return NotFound(new ApiResponse<List<NotificationResponse>>
                {
                    Data = null,
                    Message = "No notifications found for this user.",
                    Status = 404,
                    Timestamp = DateTime.Now.Ticks
                });
            }

            return Ok(new ApiResponse<List<NotificationResponse>>
            {
                Data = notifications,
                Message = "Fetched user notifications successfully.",
                Status = 200,
                Timestamp = DateTime.Now.Ticks
            });
        }

        //mine
        [HttpGet("topupHistory")]
        public async Task<IActionResult> GetTopUpHistory([FromQuery] TransactionsRequest request)
        {
            try
            {
                var transactions = await _userService.GetTransactionsAsync(request);

                if (transactions == null || !transactions.Any())
                {
                    return NotFound(new ApiResponse<List<TransactionResponse>>
                    {
                        Data = null,
                        Message = "No transactions found for this user.",
                        Status = 404,
                        Timestamp = DateTime.Now.Ticks
                    });
                }

                return Ok(new ApiResponse<List<TransactionResponse>>
                {
                    Data = transactions,
                    Message = "Fetched top-up history successfully.",
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

        //mine
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

        //mine
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

        //mine
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

        //mine
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

        [HttpGet("worker/{workerId}")]
        public async Task<IActionResult> GetUserByWorkerId(Guid workerId)
        {
            try
            {
                var user = await _userService.GetUserByWorkerId(workerId);
                var userDTO = new UserDTO
                {
                    Address = user.Address,
                    DateOfBirth = user.DateOfBirth,
                    Email = user.Email,
                    FirstName = user.FirstName,
                    Id = user.Id,
                    LastName = user.LastName,
                    PhoneNumber = user.PhoneNumber,
                    Username = user.Username,
                    RoleList = user.Roles.Select(r => r.Name).ToList(),
                    RefreshToken = user.RefreshToken,
                    RefreshTokenExpiryTime = user.RefreshTokenExpiryTime,
                    Status = user.Status.GetStringValue(),
                    AccountBalance = user.AccountBalance,
                    Password = user.Password,
                    Lat = user.Lat,
                    Lon = user.Lon,
                    Avatar = user.Avatar,
                    RoleId = user.Roles.FirstOrDefault().Id
                };
                return Ok(new ApiResponse<UserDTO>
                {
                    Data = userDTO,
                    Message = "Get user successfully!",
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