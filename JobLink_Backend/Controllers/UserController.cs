using JobLink_Backend.Services.IServices;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers
{
    public class UserController : BaseController
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        [HttpPost("change-password")]
        public async Task<IActionResult> ChangePassword(int userId, string currentPassword, string newPassword)
        {
            try
            {
                var result = await _userService.ChangePassword(userId, currentPassword, newPassword);
                if (result)
                    return Ok(new { message = "Change password successfully" });
                else
                    return BadRequest(new { message = "Change password failed" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }
    }
}
