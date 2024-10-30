using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using Microsoft.EntityFrameworkCore;

namespace JobLink_Backend.Repositories.RepositoryImpls;

public class TransactionRepositoryImpl : EFRepository<UserTransaction>, ITransactionRepository
{
    private readonly JobLinkContext _context;
    
    public TransactionRepositoryImpl(JobLinkContext context) : base(context)
    {
        _context = context;
    }
}