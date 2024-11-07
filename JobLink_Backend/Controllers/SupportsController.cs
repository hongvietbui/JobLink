using JobLink_Backend.DTOs.Request;
using JobLink_Backend.DTOs.Request.SupportRequests;
using JobLink_Backend.DTOs.Request.Transactions;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.Utilities.AmazonS3;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers;


[AllowAnonymous]
public class SupportsController(S3Uploader s3Uploader) : BaseController
{
    private readonly S3Uploader _s3Uploader = s3Uploader;
    
    // [HttpGet]
    // public async Task<IActionResult> GetAllSupportRequests([FromQuery] SupportRequestDto filter)
    // {
    //     
    // }
    //
    // [HttpPost]
    // public async Task<IActionResult> CreateNewSupportRequest([FromBody] ApiRequest<SupportRequestCreateDto> supportRequestn)
    // {
    //     if (supportRequestn.Data.Attachment == null || supportRequestn.Data.Attachment.Length == 0)
    //     {
    //         return BadRequest("The file is not valid");
    //     }
    //
    //     try
    //     {
    //         var fileUrl = await _s3Uploader.UploadFileAsync(supportRequestn.Data.Attachment);
    //         
    //         
    //         var listTransactionResponse = new ApiResponse<TransactionCreateDto>
    //         {
    //             Data = transaction.Data,
    //             Message = "Create all transactions successful",
    //             Status = 200,
    //             Timestamp = DateTime.Now.Ticks
    //         };
    //
    //         return Ok(listTransactionResponse);
    //     }
    //     catch (Exception ex)
    //     {
    //         return StatusCode(500, $"Lỗi khi upload file: {ex.Message}");
    //     }
    //    
    // }
}