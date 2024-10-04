namespace JobLink_Backend.DTOs.Response;

public class ApiResponse<T>
{
    public int Status { get; set; }
    public string Message { get; set; }
    public T? Data { get; set; }
    public long Timestamp { get; set; } = DateTimeOffset.Now.ToUnixTimeSeconds();
}