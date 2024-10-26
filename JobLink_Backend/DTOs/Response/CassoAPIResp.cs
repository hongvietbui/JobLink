using JobLink_Backend.DTOs.Response;

namespace JobLink_Backend.DTOs.All;

public class CassoAPIResp
{
    public string? Error { get; set; }
    public List<BankingTransactionDTO>? Data { get; set; }
}