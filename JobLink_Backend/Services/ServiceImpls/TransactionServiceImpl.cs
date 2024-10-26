using System.Linq.Expressions;
using System.Security.Claims;
using System.Transactions;
using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request.Transactions;
using JobLink_Backend.DTOs.Response.Transactions;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities.Jwt;
using JobLink_Backend.Utilities.Pagination;

namespace JobLink_Backend.Services.ServiceImpls;

public class TransactionServiceImpl(
    IUnitOfWork unitOfWork,
    IMapper mapper,
    IEmailService emailService,
    JwtService jwtService) : ITransactionsService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IMapper _mapper = mapper;
    private readonly IEmailService _emailService = emailService;
    private readonly JwtService _jwtService = jwtService;

    public async Task<TransactionDTO?> GetTransactionByIdAsync(Guid transactionId)
    {
        var transaction = await _unitOfWork.Repository<Transactions>().FirstOrDefaultAsync(x => x.Id == transactionId);

        return _mapper.Map<TransactionDTO>(transaction);
    }

    public async Task<Pagination<TransactionDTO>> GetAllTransactionsAsync(TransactionFilterDTO filter)
    {
        Expression<Func<Transactions, bool>> filterExpression = t =>
            (string.IsNullOrEmpty(filter.Query) || t.Id.ToString() == filter.Query)
            && (!filter.StartDate.HasValue || t.TransactionDate >= filter.StartDate)
            && (!filter.EndDate.HasValue || t.TransactionDate <= filter.EndDate);

        var listUser = await _unitOfWork.Repository<Transactions>()
            .GetAllAsync(filterExpression, filter.PageNumber, filter.PageSize);

        return _mapper.Map<Pagination<TransactionDTO>>(listUser);
    }

    public async Task AddTransactionAsync(TransactionCreateDto transactionDto, string accessToken)
    {
        var claims = _jwtService.GetPrincipalFromExpiredToken(accessToken).Claims;

        var userIdClaim = claims.FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier);
        if (userIdClaim == null || !Guid.TryParse(userIdClaim.Value, out Guid userId))
        {
            throw new Exception("User ID not found in token claims.");
        }

        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(u => u.Id == userId);
        if (transactionDto.Amount >= user.AccountBalance)
        {
            return;
        }

        Transactions transaction = _mapper.Map<Transactions>(transactionDto);
        string emailContent = $@"
<!DOCTYPE html>
<html lang='vi'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Thông báo giao dịch ${(transactionDto.PaymentType == PaymentType.Deposit ? "nạp" : "rút")} tiền</title>
    <style>
        body {{
            font-family: Arial, sans-serif;
            background-color: #f9f9f9;
            color: #333;
            margin: 0;
            padding: 20px;
        }}
        .container {{
            background-color: #ffffff;
            border-radius: 5px;
            padding: 20px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }}
        h1 {{
            color: #584287
        }}
        p {{
            line-height: 1.6;
        }}
        .footer {{
            margin-top: 20px;
            font-size: 12px;
            color: #777;
        }}
        .highlight {{
            color: #584287; /* You can change this to any color you prefer */
            font-weight: bold;
        }}
    </style>
</head>
<body>
    <div class='container'>
        <h1 style=>Kính gửi {user.FirstName} {user.LastName},</h1>
        <p>Chúng tôi xin thông báo rằng giao dịch ${(transactionDto.PaymentType == PaymentType.Deposit ? "nạp" : "rút")} tiền của quý khách đã được thực hiện thành công. Chi tiết giao dịch như sau:</p>
        <ul>
            <li>Số tiền ${(transactionDto.PaymentType == PaymentType.Deposit ? "nạp" : "rút")}: <span class='highlight'>${(transactionDto.PaymentType == PaymentType.Deposit ? "" : "-")}{transaction.Amount:N0} VND</span></li>
            <li>Thời gian giao dịch: <span class='highlight'>{DateTime.Now:dd/MM/yyyy HH:mm}</span></li>
            <li>${(transactionDto.PaymentType == PaymentType.Deposit ? "Nạp" : "Rút")} tiền về ngân hàng: <span class='highlight'>{transaction.BankName}</span></li>
            <li>Số dư còn lại: <span class='highlight'>{user.AccountBalance - transaction.Amount:N0} VND</span></li>
        </ul>
        <p>Nếu quý khách không thực hiện giao dịch này hoặc có bất kỳ thắc mắc nào, vui lòng liên hệ với bộ phận chăm sóc khách hàng của chúng tôi qua số điện thoại hoặc email hỗ trợ.</p>
        <p>Cảm ơn quý khách đã sử dụng dịch vụ của chúng tôi.</p>
        <p class='footer'>Trân trọng,<br>Đội ngũ chăm sóc khách hàng của JobLink</p>
    </div>
</body>
</html>
";

// Gửi email với nội dung đã tạo
        await _emailService.SendEmailAsync(user.Email, "Đặt lệnh rút tiền thành công", emailContent);

        user.AccountBalance = user.AccountBalance - transaction.Amount;
        await _unitOfWork.Repository<Transactions>().AddAsync(transaction);
        _unitOfWork.Repository<User>().Update(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task UpdateTransactionAsync(TransactionDTO transaction)
    {
        var transactionToUpdate =
            await _unitOfWork.Repository<Transactions>().FirstOrDefaultAsync(x => x.Id == transaction.Id);
        _unitOfWork.Repository<Transactions>().Update(transactionToUpdate);
        await _unitOfWork.SaveChangesAsync();
    }
}