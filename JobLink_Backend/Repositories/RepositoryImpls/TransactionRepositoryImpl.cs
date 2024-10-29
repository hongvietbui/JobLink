using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace JobLink_Backend.Repositories.RepositoryImpls;

public class TransactionRepositoryImpl : EFRepository<Transaction>, ITransactionRepository
{
    private readonly JobLinkContext _context;
    
    public TransactionRepositoryImpl(JobLinkContext context) : base(context)
    {
        _context = context;
    }

    public List<Transaction> GetExistedTransactionList(List<string?> transactionTids)
    {
        return _context.Set<Transaction>()
            .Where(t => transactionTids.Contains(t.Tid)).ToList();
    }
}