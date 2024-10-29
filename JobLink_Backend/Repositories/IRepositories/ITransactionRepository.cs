using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;

namespace JobLink_Backend.Repositories.IRepositories;

public interface ITransactionRepository : IRepository<Transaction>
{
    List<Transaction> GetExistedTransactionList(List<string?> transactionTids);
}