using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Response.Transactions;

namespace JobLink_Backend.DTOs.Response.Users;

public class UserHompageDTO
{
    public string? UserName { get; set; }
    public string? AccountBalance { get; set; }
    public int? TotalJobDone { get; set; }
    public string? AmountEarnedToday { get; set; }
    public string? AmountEarnedThisMonth { get; set; }
    public string? DepositAmount { get; set; }
    public int? CreateJobThisMonth { get; set; }
   }