using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using JobLink_Backend.Utilities.BaseEntities;

namespace JobLink_Backend.Entities;

public class Transactions : BaseEntity<Guid>
{
    public Guid UserId { get; set; }
    public string? Tid { get; set; }

    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }

    public PaymentType PaymentType { get; set; }
    public PaymentStatus Status { get; set; } = 0;
    [Column(TypeName = "nvarchar(51)")]
    public string? BankName { get; set; }
    [Column(TypeName = "nvarchar(51)")]
    public string? BankNumber { get; set; }
    public DateTime TransactionDate { get; set; }
    public string? UserReceive { get; set; }
    
    public User User { get; set; }
}