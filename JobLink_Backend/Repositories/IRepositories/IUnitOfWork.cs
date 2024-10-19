using System.Linq.Expressions;
using JobLink_Backend.Utilities.Pagination;

namespace JobLink_Backend.Repositories.IRepositories;

public interface IUnitOfWork : IDisposable
{
    IRepository<T> Repository<T>() where T : class;
    Task SaveChangesAsync();
    void SaveChanges(); 
}