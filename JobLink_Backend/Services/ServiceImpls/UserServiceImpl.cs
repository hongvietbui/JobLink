﻿using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.DTOs.Response.Users;
using JobLink_Backend.Entities;
using JobLink_Backend.Hubs;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities;
using JobLink_Backend.Utilities.Jwt;
using Microsoft.AspNetCore.SignalR;
using Microsoft.EntityFrameworkCore;
using System.Collections.Concurrent;
using System.Diagnostics;
using System.Linq.Expressions;
using System.Net;
using System.Net.Mail;
using System.Security.Claims;
using Microsoft.EntityFrameworkCore.Query;

namespace JobLink_Backend.Services.ServiceImpls;

public class UserServiceImpl(
    IUnitOfWork unitOfWork,
    IUserRepository userRepository,
    IMapper mapper,
    JwtService jwtService,
    IHubContext<NotificationsHub> notificationHub) : IUserService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IMapper _mapper = mapper;
    private readonly JwtService _jwtService = jwtService;
    private static readonly ConcurrentDictionary<string, OtpRecord> OtpStore = new();
    private readonly IHubContext<NotificationsHub> _notificationsHub = notificationHub;

    public async Task SaveRefreshTokenAsync(string username, string refreshToken)
    {
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Username == username);
        if (user == null) throw new ArgumentException("User not found");
        user.RefreshToken = refreshToken;
        var expiryTime = DateTime.Now.AddDays(30);
        //convert to yyyy-MM-dd HH:mm:ss
        user.RefreshTokenExpiryTime = new DateTime(expiryTime.Year, expiryTime.Month, expiryTime.Day, expiryTime.Hour, expiryTime.Minute, expiryTime.Second);

        _unitOfWork.Repository<User>().Update(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task<string> GetNewAccessTokenAsync(Guid userId, string refreshToken)
    {
        //get user by username
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Id == userId);
        if (user.RefreshToken == null || user.RefreshTokenExpiryTime < DateTime.Now)
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

    public async Task ResetPasswordAsync(string email, string newPassword)
    {
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Email == email);
        if (user == null) throw new ArgumentException("User not found");

         user.Password = PasswordHelper.HashPassword(newPassword);

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
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(u => u.Id == changePassword.UserId);
        if (user == null)
        {
            throw new Exception("User not found");
        }

        if (PasswordHelper.VerifyPassword(changePassword.CurrentPassword, user.Password))
        {
            throw new Exception("Current password is incorrect");
        }

        user.Password = PasswordHelper.HashPassword(changePassword.NewPassword);
        await _userRepository.Update(user);
        await _userRepository.SaveChangeAsync();

        return true;
    }

    public async Task<UserHompageDTO> GetUserHompageAsync(Guid userId)
    {
        var userData = await _unitOfWork.Repository<User>().FindByConditionAsync(x => x.Id == userId);

        return _mapper.Map<UserHompageDTO>(userData);
    }


    public async Task<UserDTO> GetUserByAccessToken(string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;
        var userId = Guid.Parse(claims.First(c => c.Type == ClaimTypes.NameIdentifier).Value);
        var users = await _unitOfWork.Repository<User>()
            .FindByConditionAsync(filter: u => u.Id == userId, include: u => u.Include(u => u.Roles));
        var user = users.FirstOrDefault();
        
        var userDTO = _mapper.Map<UserDTO>(user);
        
        return userDTO;
    }

    public async Task<string?> RefreshTokenAsync(string refreshToken)
    {
        var userList = await _unitOfWork.Repository<User>().FindByConditionAsync(u => u.RefreshToken == refreshToken,
            include: u => u.Include(u => u.Roles));
        //check if userList is empty or not
        if (userList == null || userList?.Count() == 0) return null;
        var user = userList?.First();
        var claimList = _jwtService.GetClaimsByUser(user.Id, user.Roles.ToList());
        return _jwtService.GenerateAccessToken(claimList);
    }

    public async Task AddNotificationAsync(string username, string message)
    {
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(u => u.Username == username);
        
        var notification = new Notification
        {
            UserId = user.Id,
            Message = message,
            Date = DateTime.Now,
            IsRead = false
        };
        await _unitOfWork.Repository<Notification>().AddAsync(notification);
        await _unitOfWork.SaveChangesAsync();
        await _notificationsHub.Clients.User(user.Id.ToString()).SendAsync("ReceiveNotification", message);
    }

    public async Task<string> GetNewAccessTokenAsync(string username, string refreshToken)
    {
        //get user by username
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Username == username);
        
        if (user.RefreshToken == null || user.RefreshTokenExpiryTime < DateTime.Now)
        {
            throw new Exception("Refresh token is invalid");
        }
        //change accessToken
        var clams = new List<Claim>
        {
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Role, user.Roles.Select(r => r.Name).ToList().ToString())
        };

        return _jwtService.GenerateAccessToken(clams);
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

    public async Task<UserHompageDTO> GetUserHompageAsync(string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;

        var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }

        // Tính toán ngày bắt đầu và kết thúc của các khoảng thời gian trước khi đưa vào truy vấn
        var todayStart = DateTime.Today;
        var tomorrowStart = todayStart.AddDays(1);

        var monthStart = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);
        var nextMonthStart = monthStart.AddMonths(1);

        var worker = await _unitOfWork.Repository<Worker>().FirstOrDefaultAsync(w => w.UserId == userId);
        
        // Bộ lọc cho các công việc hoàn thành trong ngày hôm nay
        Expression<Func<Job, bool>> totalJobDoneFilter = t =>
            t.Status == JobStatus.COMPLETED &&
            t.UpdatedAt >= todayStart &&
            t.UpdatedAt < tomorrowStart &&
            t.JobWorkers.Any(j => j.WorkerId == worker.Id);

        // Bộ lọc cho các công việc hoàn thành trong tháng hiện tại
        Expression<Func<Job, bool>> totalEarnMonthFilter = t =>
            t.Status == JobStatus.COMPLETED &&
            t.UpdatedAt >= monthStart &&
            t.UpdatedAt < nextMonthStart &&
            t.JobWorkers.Any(j => j.WorkerId == worker.Id);

        // Bộ lọc cho các công việc được tạo trong ngày hôm nay
        Expression<Func<Job, bool>> totalJobCreateFilter = t =>
            t.OwnerId == userId &&
            t.UpdatedAt >= todayStart &&
            t.UpdatedAt < tomorrowStart;

        // Bộ lọc cho các giao dịch tiền gửi trong tháng hiện tại
        Expression<Func<UserTransaction, bool>> totalDepositFilter = t =>
            t.UpdatedAt >= monthStart &&
            t.UpdatedAt < nextMonthStart &&
            t.UserId == userId;


        Func<IQueryable<User>, IIncludableQueryable<User, object>> include = query =>
            query.Include(u => u.Roles);

        var userData = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Id == userId, include);

        var totalEarnToday = await _unitOfWork.Repository<Job>().GetAllAsync(totalJobDoneFilter);

        var totalEarnMonth = await _unitOfWork.Repository<Job>().GetAllAsync(totalEarnMonthFilter);

        var totalJobCreate = await _unitOfWork.Repository<Job>().CountAsync(totalJobCreateFilter);

        var totalDeposit = await _unitOfWork.Repository<UserTransaction>().GetAllAsync(totalDepositFilter);
        UserHompageDTO response = new UserHompageDTO
        {
            UserName = userData.FirstName + " " + userData.LastName,
            AccountBalance = string.Format("{0:N0}", userData.AccountBalance),
            TotalJobDone = totalEarnToday.Count(),
            AmountEarnedToday = string.Format("{0:N0}", totalEarnToday.Sum(t => t.Price)),
            AmountEarnedThisMonth = string.Format("{0:N0}", totalEarnMonth.Sum(t => t.Price)),
            DepositAmount = string.Format("{0:N0}", totalDeposit.Sum(t => t.Amount)),
            CreateJobThisMonth = totalJobCreate
        };
        return response;
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

    public async Task<User?> LoginAsync(string username, string password)
    {
        var user = await _unitOfWork.Repository<User>()
            .FindByConditionAsync(filter: u => u.Username.ToLower() == username.ToLower(),
                include: u => u.Include(u => u.Roles));
        var foundedUser = user.FirstOrDefault();
        if (foundedUser == null)
            return null;
        if (PasswordHelper.VerifyPassword(password, foundedUser.Password))
            return foundedUser;
        return null;
    }

    public async Task<UserDTO?> RegisterAsync(RegisterRequest request)
    {
        //check if the username or email is already existed
        var isExisted = await _unitOfWork.Repository<User>()
            .AnyAsync(u => u.Username == request.Username || u.Email == request.Email);

        if (isExisted)
            return null;

        var roleList = new List<Role>();
        roleList.Add(await _unitOfWork.Repository<Role>().FirstOrDefaultAsync(r => r.Name == "User"));

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
            Status = UserStatus.PendingVerification,
            AccountBalance = 0
        };

        await _userRepository.AddAsync(newUser, roleList.Select(r => r.Name).ToList());
        await _unitOfWork.SaveChangesAsync();

        var jobOwner = new JobOwner()
        {
            Id = Guid.NewGuid(),
            UserId = newUser.Id
        };
        await _unitOfWork.Repository<JobOwner>().AddAsync(jobOwner);
        var worker = new Worker()
        {
            Id = Guid.NewGuid(),
            UserId = newUser.Id
        };
        await _unitOfWork.Repository<Worker>().AddAsync(worker);
        await _unitOfWork.SaveChangesAsync();

        return _mapper.Map<UserDTO>(newUser);
    }

    //mine
    public async Task<List<NotificationResponse>> GetUserNotificationsAsync(string username)
    {
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(u => u.Username == username);

        var notifications = await _unitOfWork.Repository<Notification>()
                                         .FindByConditionAsync(n => n.UserId == user.Id);

        return notifications.Select(n => new NotificationResponse
        {
            Id = n.Id,
            Message = n.Message,
            Date = n.Date,
            IsRead = n.IsRead
        }).ToList();
    }

    public async Task<User> GetUserByWorkerId(Guid workerId)
    {
        var worker = await _unitOfWork.Repository<Worker>().FirstOrDefaultAsync(w => w.Id == workerId);
        return await _unitOfWork.Repository<User>().FirstOrDefaultAsync(u => u.Id == worker.UserId, include: u => u.Include(u => u.Roles));
    }

    public async Task<User> GetUserByJobOwnerId(Guid jobOwnerId)
    {
        var jobOwner = await _unitOfWork.Repository<JobOwner>().FirstOrDefaultAsync(jo => jo.Id == jobOwnerId);
        return await _unitOfWork.Repository<User>().FirstOrDefaultAsync(u => u.Id == jobOwner.UserId, include: u => u.Include(u => u.Roles));
    }
    //mine
    public async Task<List<TransactionResponse>> GetTransactionsAsync(TransactionsRequest request)
    {
        var fromDate = request.FromDate ?? DateTime.MinValue;
        var toDate = request.ToDate;

        var transactions = await _unitOfWork.Repository<UserTransaction>()
        .FindByConditionAsync(t =>
            t.UserId == request.UserId &&
            t.TransactionDate >= fromDate &&
            t.TransactionDate <= toDate
        );

        return transactions.Select(t => new TransactionResponse
        {
            Amount = t.Amount,
            PaymentType = t.PaymentType,
            Status = t.Status,
            TransactionDate = t.TransactionDate
        }).ToList();
    }

    //mine
    public async Task<bool> UploadNationalIdAsync(IdRequest idRequest)
    {
        var user = await _userRepository.GetById(idRequest.userId);
        if (user == null)
        {
            throw new ArgumentException("User not found");
        }

        

        return true;
    }

    //mine
    public async Task<List<UserNationalIdDTO>> GetPendingNationalIdsAsync()
    {
        var pendingUsers = await _unitOfWork.Repository<User>()
                                         .FindByConditionAsync(u => u.NationalIdStatus == NationalIdStatus.Pending);

        return pendingUsers.Select(user => new UserNationalIdDTO
        {
            UserId = user.Id,
            NationalIdFrontUrl = user.NationalIdFrontUrl,
            NationalIdBackUrl = user.NationalIdBackUrl,
            NationalIdStatus = user.NationalIdStatus
        }).ToList();
    }

    //mine
    public async Task<UserNationalIdDTO> GetNationalIdDetailAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null || string.IsNullOrEmpty(user.NationalIdFrontUrl) || string.IsNullOrEmpty(user.NationalIdBackUrl))
        {
            throw new ArgumentException("User or National ID details not found");
        }

        return new UserNationalIdDTO
        {
            UserId = user.Id,
            NationalIdFrontUrl = user.NationalIdFrontUrl,
            NationalIdBackUrl = user.NationalIdBackUrl,
            NationalIdStatus = user.NationalIdStatus
        };
    }

    //mine
    public async Task<bool> ApproveNationalIdAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new ArgumentException("User not found");

        user.NationalIdStatus = NationalIdStatus.Approved;
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }

    //mine
    public async Task<bool> RejectNationalIdAsync(Guid userId)
    {
        var user = await _userRepository.GetByIdAsync(userId);
        if (user == null) throw new ArgumentException("User not found");

        user.NationalIdFrontUrl = null;
        user.NationalIdBackUrl = null;
        user.NationalIdStatus = NationalIdStatus.Rejected;
        _userRepository.Update(user);
        await _unitOfWork.SaveChangesAsync();
        return true;
    }
}
