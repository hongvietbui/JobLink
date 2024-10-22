using System.Linq.Expressions;
using System.Transactions;
using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request.Transactions;
using JobLink_Backend.DTOs.Response.Transactions;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;
using JobLink_Backend.Utilities.Pagination;

namespace JobLink_Backend.Services.ServiceImpls;

public class TransactionServiceImpl(IUnitOfWork unitOfWork, IMapper mapper) : ITransactionsService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IMapper _mapper = mapper;

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

    public async Task<TransactionDTO> AddTransactionAsync(TransactionDTO transactionDto)
    {
        Transactions transaction = _mapper.Map<Transactions>(transactionDto);
        await _unitOfWork.Repository<Transactions>().AddAsync(transaction);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<TransactionDTO>(transaction);
    }

    public async Task UpdateTransactionAsync(TransactionDTO transaction)
    {
        var transactionToUpdate =
            await _unitOfWork.Repository<Transactions>().FirstOrDefaultAsync(x => x.Id == transaction.Id);
        _unitOfWork.Repository<Transactions>().Update(transactionToUpdate);
        await _unitOfWork.SaveChangesAsync();
    }

 
}