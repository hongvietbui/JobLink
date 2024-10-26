using System.Text;
using System.Text.Json;
using JobLink_Backend.DTOs.Request;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;

namespace JobLink_Backend.Services.ServiceImpls;

public class VietQrService(IUnitOfWork unitOfWork, IConfiguration config, IHttpClientFactory httpClientFactory) : IVietQrService
{
    private readonly string REQUEST_URI = "generate";
    private readonly string MEDIA_TYPE = "application/json";
    
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IConfiguration _config = config;
    private HttpClient _httpClient = httpClientFactory.CreateClient("VietQRAPI");
    public async Task<string> GenerateQrCodeAsync(Guid userId)
    {
        //Get job by jobId
        var user = await _unitOfWork.Repository<User>().GetByIdAsync(userId);
        if (user == null)
        {
            throw new Exception("User not found");
        }
        //Generate QR code
        var contentReq = new VietQRReq
        {
            Format = _config.GetValue<string>("VietQR:Format"),
            Template = _config.GetValue<string>("VietQR:Template"),
            AccountName = _config.GetValue<string>("VietQR:AccountName"),
            AccountNo = _config.GetValue<string>("VietQR:AccountNo"),
            AcqId = _config.GetValue<string>("VietQR:AcqId"),
            AddInfo = userId.ToString()
        };
        _httpClient.DefaultRequestHeaders.Add("Authorization", _config.GetValue<string>("VietQR:ApiKey"));
        _httpClient.DefaultRequestHeaders.Add("x-client-id", _config.GetValue<string>("VietQR:ClientID"));

        var jsonContent = JsonSerializer.Serialize(contentReq, new JsonSerializerOptions()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        });
        
        var httpContent = new StringContent(jsonContent, Encoding.UTF8, MEDIA_TYPE);
        var response = await _httpClient.PostAsync(REQUEST_URI, httpContent);

        if (response.IsSuccessStatusCode)
        {
            var responseContent = await response.Content.ReadFromJsonAsync<VietQRResponse>();
            return responseContent.Data.QrDataURL;
        }
        else
        {
            return "";
        }
    }
}