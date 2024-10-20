using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Net.Mail;
using System.Net;

using System.Threading.Tasks;
using JobLink_Backend.DTOs.Request;


namespace JobLink_Backend.Services.ServiceImpls;

public class UserServiceImpl(IUnitOfWork unitOfWork, IUserRepository userRepository, IMapper mapper) : IUserService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IMapper _mapper = mapper;
    private static readonly ConcurrentDictionary<string, OtpRecord> OtpStore = new();
        

    public async Task SaveRefreshTokenAsync(string username, string refreshToken)
    {
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Username == username);
        if (user == null) throw new ArgumentException("User not found");

        user.RefreshToken = refreshToken;
        _unitOfWork.Repository<User>().Update(user);
    }


    public async Task<User> LoginAsync(string username, string password)
    {
        var user = await _unitOfWork.Repository<User>()
            .FirstOrDefaultAsync(u => u.Username == username && u.Password == password, u => u.Roles);

        return user;
    }

    public async Task<OtpReponse> SendResetPasswordOtpAsync(string email)
    {
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Email == email);
        if (user == null) throw new ArgumentException("User not found");

        string otp = GenerateOtp();
        var otpResponse = new OtpReponse
        {
            Email = email,
            Code = otp,
            ExpiryTime = DateTime.UtcNow.AddMinutes(5)
        };

        await SendEmailAsync(email, "Reset Password OTP", $"Your OTP is: {otp}. It only generate for 5 minutes");

        OtpStore[email] = new OtpRecord { Code = otp, ExpiryTime = otpResponse.ExpiryTime };

        return otpResponse;
    }

    public async Task<bool> VerifyOtpAsync(string email, string otp)
    {
        if (OtpStore.TryGetValue(email, out var otpRecord))
        {
            if (otpRecord.Code == otp && otpRecord.ExpiryTime > DateTime.UtcNow)
            {
                return true;
            }
        }

        return false;
    }

    public async Task ResetPasswordAsync(string email, string newPassword)
    {
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Email == email);
        if (user == null) throw new ArgumentException("User not found");

        user.Password = newPassword; 

        _unitOfWork.Repository<User>().Update(user);
        await _unitOfWork.SaveChangesAsync();
    }

    private string GenerateOtp()
    {
        Random random = new Random();
        return random.Next(100000, 999999).ToString();
    }

    private async Task SendEmailAsync(string email, string subject, string body)
    {
        Debug.WriteLine($"Sending email to {email} with subject {subject} and body {body}");
        string fromMail = "linhxautrai0307@gmail.com";
        string fromPassword = "kmindaakspwntkwa";

        MailMessage message = new MailMessage();
        message.From = new MailAddress(fromMail);
        message.Subject = "OTP CONFIRMATION!!!";
        message.To.Add(new MailAddress(email));

        message.Body = "<html><body> "+ body +" </body></html>";

        message.IsBodyHtml = true;

        var smtpClient = new SmtpClient("smtp.gmail.com")
        {
            Port = 587,
            Credentials = new NetworkCredential(fromMail, fromPassword),
            EnableSsl = true,
        };

        smtpClient.Send(message);
        await Task.CompletedTask;
    }

    private class OtpRecord
    {
        public string Code { get; set; }
        public DateTime ExpiryTime { get; set; }
    }

    public async Task<bool> ChangePassword(ChangePassworDTO changePassword)
    {
        var user = await _userRepository.GetById(changePassword.UserId);
        if (user == null)
        {
            throw new Exception("User not found");
        }

        if (user.Password != changePassword.CurrentPassword)
        {
            throw new Exception("Current password is incorrect");
        }

        user.Password = changePassword.NewPassword;
        await _userRepository.Update(user);
        await _userRepository.SaveChangeAsync();

        return true;
    }
    

    public async Task<UserDTO> RegisterAsync(RegisterRequest request)
    {
        var roleList = new List<Role>();
        roleList.Add(await _unitOfWork.Repository<Role>().FirstOrDefaultAsync(r => r.Name == "JobOwner"));
        roleList.Add(await _unitOfWork.Repository<Role>().FirstOrDefaultAsync(r => r.Name == "Worker"));
        
        //check if the role 
        var newUser = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Password = request.Password,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            DateOfBirth = DateOnly.FromDateTime(request.DateOfBirth.Value),
            Address = request.Address,
            Roles = roleList,
            Status = UserStatus.PendingVerification
        };

        await _userRepository.AddAsync(newUser);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<UserDTO>(newUser);
    }
}
