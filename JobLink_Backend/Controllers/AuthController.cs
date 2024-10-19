using System.Security.Claims;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers
{
    [AllowAnonymous]
    [EnableCors]

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

            string roleList = user.Roles.Select(r => r.Name).ToList().ToString();
        
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, roleList ?? "")
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
        
        [HttpPost("register")]
        public async Task<IActionResult> RegisterAsync([FromBody] ApiRequest<RegisterRequest> request)
        {
            var user = request.Data;
            var result = await _userService.RegisterAsync(user);
            if (result == null)
            {
                return BadRequest(new ApiResponse<string>
                {
                    Data = "",
                    Message = "Username or email is already existed",
                    Status = 400,
                    Timestamp = DateTime.Now.Ticks
                });
            }

            return Ok(new ApiResponse<string>
            {
                Data = "Register successfully!",
                Message = "Register successfully",
                Status = 200,
                Timestamp = DateTime.Now.Ticks
            });
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
