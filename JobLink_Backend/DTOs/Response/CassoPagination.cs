using JobLink_Backend.DTOs.All;

namespace JobLink_Backend.DTOs.Response;

public class CassoPagination
{
    public int? Page { get; set; }
    public int? PageSize { get; set; }
    public int? NextPage { get; set; }
    public int? PrevPage { get; set; }
    public int? TotalPages { get; set; }
    public int? TotalRecords { get; set; }
    public List<BankingTransactionDTO>? Records { get; set; }
}