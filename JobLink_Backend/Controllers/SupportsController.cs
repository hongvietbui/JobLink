using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers;


[AllowAnonymous]
public class SupportsController : BaseController
{
    
    // [HttpGet]
    // public async Task<IActionResult> GetAllSupportRequests([FromQuery] TransactionFilterDTO filter)
    // {
    //     var listTransaction = await _transactionsService.GetAllTransactionsAsync(filter);
    //
    //     var listTransactionResponse = new ApiResponse<Pagination<TransactionDTO>>
    //     {
    //         Data = listTransaction,
    //         Message = "Get all transactions successful",
    //         Status = 200,
    //         Timestamp = DateTime.Now.Ticks
    //     };
    //
    //     return Ok(listTransactionResponse);
    // }
}