using JobLink_Backend.Entities;

namespace JobLink_Backend.DTOs.Response.Transactions;

public class TransactionDTO
{
    public Guid Id { get; set; }
    public User User { get; set; }
    public decimal Amount { get; set; }

    public PaymentType PaymentType { get; set; }
    public PaymentStatus Status { get; set; }
    public string? BankName { get; set; }
    public string? BankNumber { get; set; }
    public DateTime TransactionDate { get; set; }
}