using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request.Transactions;
using JobLink_Backend.DTOs.Response;
using JobLink_Backend.DTOs.Response.Transactions;
using JobLink_Backend.Utilities.Pagination;

namespace JobLink_Backend.Services.IServices;

public interface ITransactionService
{
    Task AddNewTransactionAsync(List<BankingTransactionDTO> transactionDTOs);
    Task<TransactionDTO?> GetTransactionByIdAsync(Guid transactionId);
    Task<Pagination<TransactionDTO>> GetAllTransactionsAsync(TransactionFilterDTO filter);
    Task AddTransactionAsync(TransactionCreateDto transaction, string accessToken);
    Task UpdateTransactionAsync(TransactionDTO transaction);
    Task<List<TransactionResponse>> GetUserTransactionsAsync(DateTime? fromDate, DateTime? toDate, string accessToken);
}