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
[AllowAnonymous]
public class TransactionsController(ITransactionsService transactionsService) : BaseController
{
    private readonly ITransactionsService _transactionsService = transactionsService;


    [HttpGet]
    public async Task<IActionResult> GetAllTransactions([FromQuery] TransactionFilterDTO filter)
    {
        var listTransaction = await _transactionsService.GetAllTransactionsAsync(filter);

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
        var transactionDetail = await _transactionsService.GetTransactionByIdAsync(id);

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
    public async Task<IActionResult> CreateNewTransaction([FromBody] TransactionDTO transaction)
    {
        var transactionDetail = await _transactionsService.AddTransactionAsync(transaction);

        var listTransactionResponse = new ApiResponse<TransactionDTO>
        {
            Data = transactionDetail,
            Message = "Create all transactions successful",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        };

        return Ok(listTransactionResponse);
    }

    [HttpPut]
    public async Task<IActionResult> UpdateTransaction([FromBody] TransactionDTO transaction)
    {
        await _transactionsService.UpdateTransactionAsync(transaction);

        var listTransactionResponse = new ApiResponse<TransactionDTO>
        {
            Data = new TransactionDTO(),
            Message = "Create all transactions successful",
            Status = 200,
            Timestamp = DateTime.Now.Ticks
        };

        return Ok(listTransactionResponse);
    }
}