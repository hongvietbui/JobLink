using System.Security.Claims;
using JobLink_Backend.DTOs.Request;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [AllowAnonymous]
    public class AuthController(JwtService jwtService, IUserService userService) : BaseController
    {
        private readonly JwtService _jwtService = jwtService;
        private readonly IUserService _userService = userService;

        // Existing login endpoint
        [HttpPost("login")]
        public async Task<IActionResult> LoginAsync([FromBody] ApiRequest<LoginRequest> request)
        {
            var user = await _userService.LoginAsync(request.Data.Username, request.Data.Password);
            if (user == null)
            {
                return BadRequest(new ApiResponse<string>
                {
                    Data = "",
                    Message = "Invalid username or password",
                    Status = 400,
                    Timestamp = DateTime.Now.Ticks
                });
            }

            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role.Name)
            };

            var accessToken = _jwtService.GenerateAccessToken(claims);
            var refreshToken = _jwtService.GenerateRefreshToken();
            await _userService.SaveRefreshTokenAsync(user.Username, refreshToken);

            var loginResponse = new ApiResponse<LoginResponse>
            {
                Data = new LoginResponse
                {
                    AccessToken = accessToken,
                    RefreshToken = refreshToken
                },
                Message = "Login successfully",
                Status = 200,
                Timestamp = DateTime.Now.Ticks
            };
            return Ok(loginResponse);
        }

        [HttpPost("sent-otp")]
        public async Task<IActionResult> ForgotPasswordAsync([FromBody] ApiRequest<ForgotPassRequest> request)
        {
            await _userService.SendResetPasswordOtpAsync(request.Data.Email);
            return Ok(new ApiResponse<string>
            {
                Data = "OTP has been sent to your email",
                Message = "OTP sent successfully",
                Status = 200,
                Timestamp = DateTime.Now.Ticks
            });
        }

        [HttpPost("verify-otp")]
        public async Task<IActionResult> VerifyOtpAsync([FromBody] ApiRequest<OtpRequest> request)
        {
            bool isValid = await _userService.VerifyOtpAsync(request.Data.Email, request.Data.Code);
            if (!isValid)
            {
                return BadRequest(new ApiResponse<string>
                {
                    Data = "",
                    Message = "Invalid or expired OTP",
                    Status = 400,
                    Timestamp = DateTime.Now.Ticks
                });
            }

            return Ok(new ApiResponse<string>
            {
                Data = "OTP verified successfully",
                Message = "OTP verification success",
                Status = 200,
                Timestamp = DateTime.Now.Ticks
            });
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPasswordAsync([FromBody] ApiRequest<ResetPassword> request)
        {
            await _userService.ResetPasswordAsync(request.Data.Email, request.Data.Password);
            return Ok(new ApiResponse<string>
            {
                Data = "Password has been reset",
                Message = "Password reset successfully",
                Status = 200,
                Timestamp = DateTime.Now.Ticks
            });
        }
    }
}
