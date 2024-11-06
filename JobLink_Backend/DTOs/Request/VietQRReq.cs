namespace JobLink_Backend.DTOs.Request;

public class VietQRReq
{
    public string? Format { get; set; }
    public string? Template { get; set; }
    public string? AccountName { get; set; }
    public string? AccountNo { get; set; }
    public string? AcqId { get; set; }
    public string? AddInfo { get; set; }
    public decimal? Amount { get; set; }
}