namespace JobLink_Backend.Services.IServices;

public interface IVietQrService
{
    Task<string> GenerateQrCodeAsync(Guid userId);
}