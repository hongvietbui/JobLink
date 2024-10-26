using JobLink_Backend.DTOs.All;

namespace JobLink_Backend.Services.IServices;

public interface ITransactionService
{
    Task AddNewTransactionAsync(List<BankingTransactionDTO> transactionDTO);
}