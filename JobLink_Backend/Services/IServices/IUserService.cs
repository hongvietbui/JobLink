using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request;
using JobLink_Backend.Entities;
using JobLink_Backend.DTOs.Response;

namespace JobLink_Backend.Services.IServices
{
    public interface IUserService
    {
        Task SaveRefreshTokenAsync(string username, string refreshToken);
        Task<string> GetNewAccessTokenAsync(Guid userId, string refreshToken);
        Task<User?> LoginAsync(string username, string password);
        Task LogoutAsync(string username); 
        Task<UserDTO?> RegisterAsync(RegisterRequest request);
        Task<OtpReponse> SendResetPasswordOtpAsync(string email); 
        Task<bool> VerifyOtpAsync(string email, string otp); 
        Task ResetPasswordAsync(string email, string newPassword);
        Task AddNotificationAsync(Guid userId, string message);
        Task<IEnumerable<NotificationDTO>> GetUserNotificationsAsync(Guid userId);
        Task<bool> ChangePassword(ChangePassworDTO changePassword);
        Task<UserDTO> GetUserByAccessToken(string accessToken);
        Task<string?> RefreshTokenAsync(string refreshToken);
    }
}
