using System.Linq.Expressions;
using System.Security.Claims;
using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request.Transactions;
using JobLink_Backend.DTOs.Response.Transactions;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities.Jwt;
using JobLink_Backend.Utilities.Pagination;
using JobLink_Backend.Utilities.SignalR.Hubs;
using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;

namespace JobLink_Backend.Services.ServiceImpls;

public class TransactionServiceImpl(IUnitOfWork unitOfWork, IEmailService emailService, IMapper mapper, JwtService jwtService, IHubContext<TransferHub> hubContext) : ITransactionService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IEmailService _emailService = emailService;
    private readonly IMapper _mapper = mapper;
    private readonly JwtService _jwtService = jwtService;
    private readonly IHubContext<TransferHub> _hubContext = hubContext;
    
    public async Task AddNewTransactionAsync(List<BankingTransactionDTO> transactionDTOs)
    {
        if (transactionDTOs == null || !transactionDTOs.Any())
            return;
        
        var tids = transactionDTOs
            .Where(t => !string.IsNullOrEmpty(t.Tid) && !string.IsNullOrEmpty(t.Description) && TryParseGuid(t.Description.Split(" ")[0]) != null)
            .Select(dto => dto.Tid)
            .Distinct()
            .ToList();

        var existingTransactions = await _unitOfWork.Repository<Transaction>()
            .FindByConditionAsync(filter: t => tids.Contains(t.Tid));

        var existingTids = existingTransactions!=null ? new HashSet<string?>(existingTransactions.Select(et => et.Tid)) : new HashSet<string?>();
        
        var newTransactions = transactionDTOs
            .Where(t => !string.IsNullOrEmpty(t.Tid) && !existingTids.Contains(t.Tid))
            .Select(dto => new Transaction
            {
                Id =  Guid.NewGuid(),
                UserId = TryParseGuid(dto.Description.Split(" ")[0]).GetValueOrDefault(),
                Tid = dto.Tid,
                Amount = dto.Amount.GetValueOrDefault(0),
                TransactionDate = dto.When.GetValueOrDefault(DateTime.Now),
                PaymentType = dto.Amount.GetValueOrDefault(0) > 0 ? PaymentType.Deposit : PaymentType.Withdraw,
                BankName = dto.BankName,
                BankNumber = dto.BankSubAccId,
            }).ToList();
        
        if (newTransactions.Any())
        {
            await _unitOfWork.Repository<Transaction>().AddRangeAsync(newTransactions);
            await _unitOfWork.SaveChangesAsync();
        }
        
        SendTransferMessageToUsers(newTransactions);
    }
    
    private void SendTransferMessageToUsers(List<Transaction> transactions)
    {
        var transactionDTOs = _mapper.Map<List<TransactionDTO>>(transactions);
        
        foreach (var transactionDTO in transactionDTOs)
        {
            var message = JsonConvert.SerializeObject(transactionDTO);
            _hubContext.Clients.Group(transactionDTO.UserId.ToString()).SendAsync("ReceiveTransfer", message);
        }
    }
    
    private Guid? TryParseGuid(string input)
    {
        if (input.Length >= 32)
        {
            var guidString = input.Substring(0, 32);
            
            guidString = $"{guidString.Substring(0, 8)}-{guidString.Substring(8, 4)}-{guidString.Substring(12, 4)}-{guidString.Substring(16, 4)}-{guidString.Substring(20)}";
        
            if (Guid.TryParse(guidString, out Guid guid))
            {
                return guid;
            }
        }
        return null;
    }
    
    private bool IsGuid(string? description)
    {
        return Guid.TryParse(description, out _);
    }
    
    public async Task<TransactionDTO?> GetTransactionByIdAsync(Guid transactionId)
    {
        var transaction = await _unitOfWork.Repository<Transaction>().FirstOrDefaultAsync(x => x.Id == transactionId);

        return _mapper.Map<TransactionDTO>(transaction);
    }

    public async Task<Pagination<TransactionDTO>> GetAllTransactionsAsync(TransactionFilterDTO filter)
    {
        Expression<Func<Transaction, bool>> filterExpression = t =>
            (string.IsNullOrEmpty(filter.Query) || t.Id.ToString() == filter.Query)
            && (!filter.StartDate.HasValue || t.TransactionDate >= filter.StartDate)
            && (!filter.EndDate.HasValue || t.TransactionDate <= filter.EndDate);

        var listUser = await _unitOfWork.Repository<Transaction>()
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

        Transaction transaction = _mapper.Map<Transaction>(transactionDto);
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
        await _unitOfWork.Repository<Transaction>().AddAsync(transaction);
        _unitOfWork.Repository<User>().Update(user);
        await _unitOfWork.SaveChangesAsync();
    }

    public async Task UpdateTransactionAsync(TransactionDTO transaction)
    {
        var transactionToUpdate =
            await _unitOfWork.Repository<Transaction>().FirstOrDefaultAsync(x => x.Id == transaction.Id);
        _unitOfWork.Repository<Transaction>().Update(transactionToUpdate);
        await _unitOfWork.SaveChangesAsync();
    }
}