﻿using JobLink_Backend.DTOs.Request;
using JobLink_Backend.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class UserController : BaseController
    {
        private readonly IUserService _userService;

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
    }
}
