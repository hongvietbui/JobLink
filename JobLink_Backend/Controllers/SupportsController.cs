using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request;
using JobLink_Backend.DTOs.Request.SupportRequests;
using JobLink_Backend.DTOs.Request.Transactions;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.Entities;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities.AmazonS3;
using JobLink_Backend.Utilities.Pagination;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers;

[AllowAnonymous]
public class SupportsController(
    IJobService jobService,
    S3Uploader s3Uploader,
    ISupportRequestService supportRequestService) : BaseController
{
    private readonly S3Uploader _s3Uploader = s3Uploader;
    private readonly IJobService _jobService = jobService;

    private readonly ISupportRequestService _supportRequestService = supportRequestService;
    [HttpGet]
    public async Task<IActionResult> GetAllSupportRequests([FromQuery] SupportRequestFilter filter)
    {
        var listSupportRequests = await _supportRequestService.GetAllSupportRequestsAsync(filter);

        var listSupportRequestsResponse = new ApiResponse<Pagination<SupportRequestDto>>
        {
            Data = listSupportRequests,
            Message = "Get all transactions successful",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        };

        return Ok(listSupportRequestsResponse);
    }


    [HttpGet("id")]
    public async Task<IActionResult> GetSupportRequestById([FromQuery] Guid id)
    {
        var supportReuest = await _supportRequestService.GetSupportRequestByIdAsync(id);

        if (supportReuest == null)
            return NotFound(new ApiResponse<SupportRequestDto>
            {
                Data = null,
                Message = "Support request not found",
                Status = 404,
                Timestamp = DateTime.Now.Ticks
            });

        return Ok(new ApiResponse<SupportRequestDto>
        {
            Data = supportReuest,
            Message = "Get support request details successfully!",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        });
    }

    [HttpPost]
    public async Task<IActionResult> CreateNewSupportRequest(
        [FromForm] SupportRequestCreateDto supportRequest , [FromHeader] string authorization)
    {
        string accessToken = authorization.Split(" ")[1];
        if (supportRequest.Attachment == null || supportRequest.Attachment.Length == 0)
        {
            return BadRequest("The file is not valid");
        }

        try
        {
            var fileUrl = await _s3Uploader.UploadFileAsync(supportRequest.Attachment);
            //var fileUrl = "https://gaohouse.vn/wp-content/uploads/2024/06/mau-ao-lop-dep-1.jpg";
            decimal feeRequest = 0;
            // Kiểm tra số dư trước khi tạo yêu cầu hỗ trợ mới
            switch (supportRequest.Priority)
            {
                case SupportPriority.High:
                    feeRequest = 5000;
                    break;
                case SupportPriority.Medium:
                    feeRequest = 3000;
                    break;
                case SupportPriority.Low:
                    feeRequest = 1000;
                    break;
                default:
                    feeRequest = 0;
                    break;
            }

            bool hasEnoughBalance = await _jobService.CheckUserBalanceAsync(accessToken, feeRequest);

            if (!hasEnoughBalance)
            {
                return StatusCode(402, new ApiResponse<SupportRequestDto>
                {
                    Data = null,
                    Message = "Insufficient funds. Please recharge your account.",
                    Status = 402, // HTTP 402 Payment Required
                    Timestamp = DateTime.Now.Ticks
                });
            }

            var result = await _supportRequestService.AddNewSupportRequestAsync(supportRequest, fileUrl, accessToken);
            return CreatedAtAction(nameof(GetSupportRequestById), new { id = result.Id },
                new ApiResp<SupportRequestDto>(201, "Job created", result));
        }
        catch (Exception ex)
        {
            return StatusCode(500, $"Lỗi khi upload file: {ex.Message}");
        }
    }
    
    
    
    [HttpPatch("{id}")]
    public async Task<IActionResult> UpdateSupportRequestStatus([FromRoute] Guid id)
    {
        var supportRequest = await _supportRequestService.GetSupportRequestByIdAsync(id);

        if (supportRequest == null)
            return NotFound(new ApiResponse<SupportRequestDto>
            {
                Data = null,
                Message = "Support request not found",
                Status = 404,
                Timestamp = DateTime.Now.Ticks
            });

        var newSupportRequest = await _supportRequestService.UpdateSupportRequestStatus(id);
        return Ok(new ApiResponse<SupportRequestDto>
        {
            Data = newSupportRequest,
            Message = "Get support request details successfully!",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        });
    }
}