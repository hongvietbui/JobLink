using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities.AmazonS3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers;

[AllowAnonymous]
public class TestController(S3Uploader s3Uploader, IVietQrService vietQrService) : BaseController
{
    private readonly S3Uploader _s3Uploader = s3Uploader;
    private readonly IVietQrService _qrService = vietQrService;
    
    [HttpPost("upload")]
    public async Task<IActionResult> UploadFile([FromForm] IFormFile file)
    {
        if (file == null || file.Length == 0)
        {
            return BadRequest("File không hợp lệ.");
        }

        try
        {
            var fileUrl = await _s3Uploader.UploadFileAsync(file);
            return Ok(new { Url = fileUrl });
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi upload file: {ex.Message}");
        }
    }
    
    [HttpGet("vietQR/{jobId}")]
    public async Task<IActionResult> GetVietQRUrl(string userId)
    {
        var qrUrl = await _qrService.GenerateQrCodeAsync(Guid.Parse(userId));
        return Ok(new { Url = qrUrl });
    }
}