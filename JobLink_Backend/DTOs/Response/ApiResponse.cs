namespace JobLink_Backend.DTOs.Response;

public class ApiResponse<T>
{
    public int Status { get; set; }
    public string Message { get; set; }
    public T? Data { get; set; }
    public long Timestamp { get; set; } = DateTimeOffset.Now.ToUnixTimeSeconds();
}
public class ApiResp<T>(int status, string message, T? data)
{
    public int Status { get; set; } = status;
    public string Message { get; set; } = message;
    public T? Data { get; set; } = data;
    public long Timestamp { get; set; } = DateTimeOffset.Now.ToUnixTimeSeconds();
}