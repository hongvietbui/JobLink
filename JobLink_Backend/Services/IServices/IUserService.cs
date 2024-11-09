using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request;
using JobLink_Backend.Entities;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.DTOs.Response.Users;

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
        Task<bool> ChangePassword(ChangePassworDTO changePassword);
        Task<UserDTO> GetUserByAccessToken(string accessToken);
        Task<string?> RefreshTokenAsync(string refreshToken);
        Task<UserHompageDTO> GetUserHompageAsync(string accessToken);
        Task<User> GetUserByWorkerIdAsync(Guid workerId);
        Task<Worker> GetWorkerByUserIdAsync(Guid userId);
        Task<User> GetUserByJobOwnerId(Guid jobOwnerId);
        
        //mine
        Task AddNotificationAsync(string username, string message);
        Task<List<NotificationResponse>> GetUserNotificationsAsync(string username);
        Task<NationalIdResponse> UploadNationalIdAsync(string accessToken, IFormFile nationalIdFront, IFormFile nationalIdBack);
        Task<List<UserNationalIdDTO>> GetPendingNationalIdsAsync();
        Task<UserNationalIdDTO> GetNationalIdDetailAsync(Guid userId);
        Task<bool> ApproveNationalIdAsync(Guid userId);
        Task<bool> RejectNationalIdAsync(Guid userId);
        Task<bool> UpdateUserAsync(Guid id, UpdateUserDTO data);
    }
}
