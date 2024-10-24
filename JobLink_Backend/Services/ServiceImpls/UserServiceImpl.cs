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
using System.Security.Claims;
using JobLink_Backend.Utilities;
using JobLink_Backend.Utilities.Jwt;
using Microsoft.EntityFrameworkCore;

namespace JobLink_Backend.Services.ServiceImpls;

public class UserServiceImpl(IUnitOfWork unitOfWork, IUserRepository userRepository, IMapper mapper, JwtService jwtService) : IUserService
{
	private readonly IUnitOfWork _unitOfWork = unitOfWork;
	private readonly IUserRepository _userRepository = userRepository;
	private readonly IMapper _mapper = mapper;
	private readonly JwtService _jwtService = jwtService;
	private static readonly ConcurrentDictionary<string, OtpRecord> OtpStore = new();

	public async Task SaveRefreshTokenAsync(string username, string refreshToken)
	{
		var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Username == username);
		if (user == null) throw new ArgumentException("User not found");
		user.RefreshToken = refreshToken;
		user.RefreshTokenExpiryTime = DateTime.Now.AddDays(30);
		_unitOfWork.Repository<User>().Update(user);
		await _unitOfWork.SaveChangesAsync();
	}

    public async Task<string> GetNewAccessTokenAsync(Guid userId, string refreshToken)
    {
        //get user by username
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Id == userId);
        if(user.RefreshToken == null || user.RefreshTokenExpiryTime < DateTime.Now)
        {
	        return "";
        }
        //change accessToken
        var clams = _jwtService.GetClaimsByUser(userId, user.Roles.ToList());
        return _jwtService.GenerateAccessToken(clams);
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
		message.Body = "<html><body> " + body + " </body></html>";
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

	public async Task<UserDTO> GetUserByAccessToken(string accessToken)
	{
		var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;
		var userId = Guid.Parse(claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
		var user = await _unitOfWork.Repository<User>().GetByIdAsync(userId);
		return _mapper.Map<UserDTO>(user);
	}

	public async Task<string?> RefreshTokenAsync(string refreshToken)
	{
		var userList = await _unitOfWork.Repository<User>().FindByConditionAsync(u => u.RefreshToken == refreshToken, include: u => u.Include(u => u.Roles));
		//check if userList is empty or not
		if (userList == null || userList?.Count() == 0) return null;
		var user = userList?.First();
		var claimList = _jwtService.GetClaimsByUser(user.Id, user.Roles.ToList());
		return _jwtService.GenerateAccessToken(claimList);
	}

	public async Task LogoutAsync(string username)
	{
		//find user
		var userList = await _unitOfWork.Repository<User>().FindByConditionAsync(filter: u => u.Username == username, include: u => u.Include(user => user.Roles));

		//delete refresh token
		var user = userList?.FirstOrDefault();
		if (user != null)
		{
			user.RefreshToken = null;
			_unitOfWork.Repository<User>().Update(user);
		}
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
			Password = PasswordHelper.HashPassword(request.Password),
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

	public async Task AddNotificationAsync(Guid userId, string message)
	{
		var notification = new Notification
		{
			UserId = userId,
			Message = message,
			Date = DateTime.Now,
			IsRead = false
		};
		await _unitOfWork.Repository<Notification>().AddAsync(notification);
		await _unitOfWork.SaveChangesAsync();
    }
    
    public async Task<User?> LoginAsync(string username, string password)
    {
        var user = await _unitOfWork.Repository<User>().FindByConditionAsync(filter: u => u.Username.ToLower() == username.ToLower(), include: u => u.Include(u => u.Roles));
        var foundedUser = user.FirstOrDefault();
        if(foundedUser == null) 
            return null;
        if(PasswordHelper.VerifyPassword(password, foundedUser.Password))
            return foundedUser;
        return null;
    }

    public async Task LogoutAsync(string username)
    {
        //find user
        var userList = await _unitOfWork.Repository<User>().FindByConditionAsync(filter: u => u.Username == username, include: u => u.Include(user => user.Roles));

        //delete refresh token
        var user = userList?.FirstOrDefault();
        if (user != null)
        {
            user.RefreshToken = null;
            _unitOfWork.Repository<User>().Update(user);
        }
    }

    public async Task<UserDTO?> RegisterAsync(RegisterRequest request)
    {
        //check if the username or email is already existed
        var isExisted = await _unitOfWork.Repository<User>().AnyAsync(u => u.Username == request.Username || u.Email == request.Email);

        if (isExisted)
            return null;
        
        var roleList = new List<Role>();
        roleList.Add(await _unitOfWork.Repository<Role>().FirstOrDefaultAsync(r => r.Name == "JobOwner"));
        roleList.Add(await _unitOfWork.Repository<Role>().FirstOrDefaultAsync(r => r.Name == "Worker"));
        
        //check if the role 
        var newUser = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Password = PasswordHelper.HashPassword(request.Password),
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
 
    public async Task<IEnumerable<NotificationDTO>> GetUserNotificationsAsync(Guid userId)
	{
		var notification = await _unitOfWork.Repository<Notification>().FindByConditionAsync(n => n.UserId == userId);
		return notification.Select(n => new NotificationDTO
		{
			Message = n.Message,
			Date = n.Date,
			IsRead = n.IsRead
		}).ToList();
	}
}
