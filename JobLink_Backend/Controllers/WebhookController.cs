using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.Services.IServices;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;

namespace JobLink_Backend.Controllers;

public class WebhookController(IConfiguration config, ITransactionService transactionService) : BaseController
{
    private readonly IConfiguration _config = config;
    private readonly ITransactionService _transactionService = transactionService;
    
    [HttpPost]
    [AllowAnonymous]
    public async Task<IActionResult> ReceiveWebhook([FromBody] JsonElement payload, [FromHeader(Name = "Secure-Token")] string signature)
    {
        var secretKey = _config.GetValue<string>("Casso:SecretKey");

        if (secretKey != signature)
        {
            return Unauthorized(new ApiResponse<string>
            {
                Data = "Unauthorized",
                Timestamp = DateTime.UtcNow.Ticks
            });
        }

        var rawText = payload.GetRawText();
        // Deserialize payload thành BankingTransactionDTO
        var bankingTransaction = JsonConvert.DeserializeObject<CassoAPIResp>(rawText);

        await _transactionService.AddNewTransactionAsync(bankingTransaction.Data);
        
        return Ok(new ApiResponse<CassoAPIResp>
        {
            Data = bankingTransaction,
            Timestamp = DateTime.UtcNow.Ticks
        });
    }
}