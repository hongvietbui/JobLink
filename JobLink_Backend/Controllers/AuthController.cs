using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers;
[Route("api/[controller]")]
[ApiController]

public class AuthController : BaseController
{
    private readonly IConfiguration _configuration;
    private readonly JobLinkContext _context;

    public AuthController(IConfiguration configuration, JobLinkContext context)
    {
        _configuration = configuration;
        _context = context;
    }

    [HttpPost("Login")]
    public async Task<IActionResult> Login([FromBody] Login user)
    {
        var email = _context.Users.FirstOrDefault(x => x.Username == user.Username);
        var password = _context.Users.FirstOrDefault(x => x.Password == user.Password);
        if (user != null)
        {
            return Ok();
        }
        return Unauthorized();
    }
}