using JobLink_Backend.DTOs.Request;
using JobLink_Backend.DTOs.Request.Transactions;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.DTOs.Response.Transactions;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities.Pagination;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers;

[Route("api/[controller]")]
[ApiController]
public class TransactionController(ITransactionService transactionsService, IVietQrService vietQrService) : BaseController
{
    private readonly ITransactionService _transactionService = transactionsService;
    private readonly IVietQrService _qrService = vietQrService;


    [HttpGet]
    public async Task<IActionResult> GetAllTransactions([FromQuery] TransactionFilterDTO filter)
    {
        var listTransaction = await _transactionService.GetAllTransactionsAsync(filter);

        var listTransactionResponse = new ApiResponse<Pagination<TransactionDTO>>
        {
            Data = listTransaction,
            Message = "Get all transactions successful",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        };

        return Ok(listTransactionResponse);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetDetailTransactions(Guid id)
    {
        var transactionDetail = await _transactionService.GetTransactionByIdAsync(id);

        var listTransactionResponse = new ApiResponse<TransactionDTO>
        {
            Data = transactionDetail,
            Message = "Get transaction successful",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        };

        return Ok(listTransactionResponse);
    }

    [HttpPost]
    public async Task<IActionResult> CreateNewTransaction([FromBody] ApiRequest<TransactionCreateDto> transaction, [FromHeader] string authorization)
    {
        var accessToken = authorization.Split(" ")[1];
        await _transactionService.AddTransactionAsync(transaction.Data, accessToken);

        var listTransactionResponse = new ApiResponse<TransactionCreateDto>
        {
            Data = transaction.Data,
            Message = "Create all transactions successful",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        };

        return Ok(listTransactionResponse);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateTransaction([FromBody] ApiRequest<TransactionDTO> transaction)
    {
        await _transactionService.UpdateTransactionAsync(transaction.Data);

        var listTransactionResponse = new ApiResponse<TransactionDTO>
        {
            Data = transaction.Data,
            Message = "Create all transactions successful",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        };

        return Ok(listTransactionResponse);
    }

    [HttpGet("topupHistory")]
    public async Task<IActionResult> GetUserTransactions(
   [FromQuery] DateTime? fromDate,
   [FromQuery] DateTime? toDate,
   [FromHeader] string authorization)
    {
        if (_transactionService == null)
        {
            return StatusCode(500, new ApiResponse<string>
            {
                Data = null,
                Message = "Transaction service is not initialized.",
                Status = 500,
                Timestamp = DateTime.Now.Ticks
            });
        }

        if (string.IsNullOrEmpty(authorization) || !authorization.StartsWith("Bearer "))
        {
            return BadRequest(new ApiResponse<string>
            {
                Data = null,
                Message = "Invalid authorization format.",
                Status = 400,
                Timestamp = DateTime.Now.Ticks
            });
        }

        var accessToken = authorization.Split(" ")[1];

        try
        {
            var transactions = await _transactionService.GetUserTransactionsAsync(fromDate, toDate, accessToken);

            if (transactions == null || !transactions.Any())
            {
                return NotFound(new ApiResponse<List<TransactionResponse>>
                {
                    Data = null,
                    Message = "No transactions found for this user.",
                    Status = 404,
                    Timestamp = DateTime.Now.Ticks
                });
            }

            return Ok(new ApiResponse<List<TransactionResponse>>
            {
                Data = transactions,
                Message = "Fetched user transactions successfully.",
                Status = 200,
                Timestamp = DateTime.Now.Ticks
            });
        }
        catch (Exception ex)
        {
            return StatusCode(500, new ApiResponse<string>
            {
                Data = null,
                Message = ex.Message,
                Status = 500,
                Timestamp = DateTime.Now.Ticks
            });
        }
    }

    [HttpGet("vietQR/{userId}")]
    public async Task<IActionResult> GetVietQRUrl(string userId)
    {
        var qrUrl = await _qrService.GenerateQrCodeAsync(Guid.Parse(userId));
        return Ok(new ApiResponse<String>
        {
            Data = qrUrl,
            Message = "Get VietQR successful",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        });
    }
}