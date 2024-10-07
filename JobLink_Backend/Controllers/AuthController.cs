using System.Security.Claims;
using JobLink_Backend.DTOs.Request;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities.Jwt;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers;

[AllowAnonymous]
public class AuthController(JwtService jwtService, IUserService userService) : BaseController
{
    private readonly JwtService _jwtService = jwtService;
    private readonly IUserService _userService = userService;

    [HttpPost("login")]
    public async Task<IActionResult> LoginAsync([FromBody] ApiRequest<LoginRequest> request)
    {
        var user = await _userService.LoginAsync(request.Data.Username, request.Data.Password);
        //check if the user is null or nots
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
            Message = "Login successful",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        };
        return Ok(loginResponse);
    }
}