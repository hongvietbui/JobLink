using JobLink_Backend.Entities;

namespace JobLink_Backend.DTOs.Request.Transactions;

public class TransactionCreateDto
{
    public Guid UserId { get; set; }
    public decimal Amount { get; set; }
    public PaymentType PaymentType { get; set; }
    public string? BankName { get; set; }
    public string? BankNumber { get; set; }
    public string? UserReceive { get; set; }
    public DateTime TransactionDate { get; set; }
}