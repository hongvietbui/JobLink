using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
[EnableCors("AllowAll")]
public class BaseController : ControllerBase
{
    
}