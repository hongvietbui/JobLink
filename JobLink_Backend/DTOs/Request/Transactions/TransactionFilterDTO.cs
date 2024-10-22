namespace JobLink_Backend.DTOs.Request.Transactions;

public class TransactionFilterDTO : PagingFilterBase
{
    public string? Query { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public Guid? UserId { get; set; }
    public bool? Status { get; set; }
}