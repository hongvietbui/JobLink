namespace JobLink_Backend.DTOs.Response.Jobs;

public class JobStatisticalResponseDto
{
    public DateTime Date { get; set; }
    public string? Deposit { get; set; }
    public string? Earn  { get; set; }
}