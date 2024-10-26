using System.Security.Cryptography;
using System.Text;
using System.Text.Json;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Response;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace JobLink_Backend.Controllers;

public class WebhookController(IConfiguration config) : BaseController
{
    private readonly IConfiguration _config = config;
    
    [HttpPost]
    [AllowAnonymous]
    public IActionResult ReceiveWebhook([FromBody] JsonElement payload, [FromHeader(Name = "Secure-Token")] string signature)
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
        
        // Deserialize payload thành BankingTransactionDTO
        var bankingTransaction = JsonSerializer.Deserialize<CassoAPIResp>(payload.GetRawText());
        
        
        return Ok(new ApiResponse<CassoAPIResp>
        {
            Data = bankingTransaction,
            Timestamp = DateTime.UtcNow.Ticks
        });
    }
}