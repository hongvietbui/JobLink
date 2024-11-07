using JobLink_Backend.DTOs.Request;
using JobLink_Backend.DTOs.Request.SupportRequests;
using JobLink_Backend.DTOs.Request.Transactions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers;


[AllowAnonymous]
public class SupportsController : BaseController
{
    
    // [HttpGet]
    // public async Task<IActionResult> GetAllSupportRequests([FromQuery] SupportRequestDto filter)
    // {
    //     
    // }
    
    [HttpPost]
    public async Task<IActionResult> CreateNewSupportRequest([FromBody] ApiRequest<TransactionCreateDto> transaction, [FromHeader] string authorization)
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
}