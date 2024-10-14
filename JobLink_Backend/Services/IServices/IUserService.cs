using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request;
using JobLink_Backend.Entities;
using JobLink_Backend.DTOs.Response;

namespace JobLink_Backend.Services.IServices
{
    public interface IUserService
    {
        Task SaveRefreshTokenAsync(string username, string refreshToken);

        Task<User> LoginAsync(string username, string password);

        Task<UserDTO> RegisterAsync(RegisterRequest request);

        Task<OtpReponse> SendResetPasswordOtpAsync(string email); 

        Task<bool> VerifyOtpAsync(string email, string otp); 

        Task ResetPasswordAsync(string email, string newPassword);
        Task<bool> ChangePassword(int userId, string currentPassword, string newPassword);
    }
}
