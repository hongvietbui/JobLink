using System.Transactions;
using JobLink_Backend.DTOs.Request.Transactions;
using JobLink_Backend.DTOs.Response.Transactions;
using JobLink_Backend.Utilities.Pagination;

namespace JobLink_Backend.Services.IServices;

public interface ITransactionsService
{
    Task<TransactionDTO?> GetTransactionByIdAsync(Guid transactionId);
    Task<Pagination<TransactionDTO>> GetAllTransactionsAsync(TransactionFilterDTO filter);
    Task AddTransactionAsync(TransactionCreateDto transaction, string accessToken);
    Task UpdateTransactionAsync(TransactionDTO transaction);
}