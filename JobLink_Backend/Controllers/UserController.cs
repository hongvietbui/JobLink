using AutoMapper;
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
	public class UserController(IUserService userService, JwtService jwtService, IMapper mapper) : BaseController
	{
		private readonly IUserService _userService = userService;
		private readonly JwtService _jwtService = jwtService;
		private readonly IMapper _mapper = mapper;

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
		[HttpGet("notifications")]
		public async Task<IActionResult> GetUserNotifications([FromHeader] string authorization)
		{
			if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
			{
				return BadRequest(new ApiResponse<string>
				{
					Data = null,
					Message = "Invalid authorization format.",
					Status = 400,
					Timestamp = DateTime.Now.Ticks
				});
			}

			var accessToken = authorization.Split(" ")[1];

			try
			{
				var notifications = await _userService.GetUserNotificationsAsync(accessToken);

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
			catch (Exception ex)
			{
				return StatusCode(500, new ApiResponse<string>
				{
					Data = null,
					Message = $"An error occurred: {ex.Message}",
					Status = 500,
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
		public async Task<IActionResult> GetNationalIdDetails(Guid userId)
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
		public async Task<IActionResult> ApproveNationalId(Guid userId)
		{
			try
			{
				var result = await _userService.ApproveNationalIdAsync(userId);
				if (result)
				{
					return Ok(new ApiResponse<string>
					{
						Data = null,
						Message = "National ID approved successfully",
						Status = 200,
						Timestamp = DateTime.Now.Ticks
					});
				}
				return BadRequest(new ApiResponse<string>
				{
					Data = null,
					Message = "Failed to approve National ID",
					Status = 400,
					Timestamp = DateTime.Now.Ticks
				});
			}
			catch (Exception ex)
			{
				return StatusCode(500, new ApiResponse<string>
				{
					Data = null,
					Message = $"An error occurred: {ex.Message}",
					Status = 500,
					Timestamp = DateTime.Now.Ticks
				});
			}
		}

		[HttpPost("national-id/{userId}/reject")]
		public async Task<IActionResult> RejectNationalId(Guid userId)
		{
			try
			{
				var result = await _userService.RejectNationalIdAsync(userId);
				if (result)
				{
					return Ok(new ApiResponse<string>
					{
						Data = null,
						Message = "National ID rejected successfully",
						Status = 200,
						Timestamp = DateTime.Now.Ticks
					});
				}
				return BadRequest(new ApiResponse<string>
				{
					Data = null,
					Message = "Failed to reject National ID",
					Status = 400,
					Timestamp = DateTime.Now.Ticks
				});
			}
			catch (Exception ex)
			{
				return StatusCode(500, new ApiResponse<string>
				{
					Data = null,
					Message = $"An error occurred: {ex.Message}",
					Status = 500,
					Timestamp = DateTime.Now.Ticks
				});
			}
		}

		[HttpGet("worker/{workerId}")]
		public async Task<IActionResult> GetUserByWorkerId(Guid workerId)
		{
			try
			{
				var user = await _userService.GetUserByWorkerId(workerId);
				var userDTO = _mapper.Map<UserDTO>(user);
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

		[HttpPost("nationalId/upload")]
		public async Task<IActionResult> UploadNationalIdPictures(
			[FromHeader] string authorization,
			[FromForm] NationalIdRequest request)
		{
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

			try
			{
				var response = await _userService.UploadNationalIdAsync(accessToken, request.NationalIdFront, request.NationalIdBack);
				return Ok(new ApiResponse<NationalIdResponse>
				{
					Data = response,
					Message = "National ID pictures uploaded successfully.",
					Status = 200,
					Timestamp = DateTime.Now.Ticks
				});
			}
			catch (Exception ex)
			{
				return StatusCode(500, new ApiResponse<string>
				{
					Data = null,
					Message = $"An error occurred: {ex.Message}",
					Status = 500,
					Timestamp = DateTime.Now.Ticks
				});
			}
		}
	}
}