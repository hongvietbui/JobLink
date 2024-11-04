namespace JobLink_Backend.DTOs.Response;

public class VietQRResponse
{
    public string Code { get; set; }
    public string Desc { get; set; }
    public QRData Data { get; set; }
}