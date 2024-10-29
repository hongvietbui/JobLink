using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;

namespace JobLink_Backend.Repositories.IRepositories;

public interface ITransactionRepository : IRepository<Transactions>
{
    List<Transactions> GetExistedTransactionList(List<string?> transactionTids);
}