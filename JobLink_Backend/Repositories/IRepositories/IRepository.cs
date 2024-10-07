using System.Linq.Expressions;
using JobLink_Backend.Utilities.Pagination;

namespace JobLink_Backend.Repositories.IRepositories;

public interface IRepository<T> where T : class
{
    #region Add

    Task AddAsync(T entity);
    Task AddRangeAsync(IEnumerable<T> entities);
    #endregion

    #region Read
    Task<IEnumerable<T>> GetAllAsync();
    IQueryable<T> GetAll();
    Task<Pagination<T>> GetAllAsync(int pageIndex = 1, int pageSize = 10);
    Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> filter);
    Task<Pagination<T>> GetAllAsync(Expression<Func<T, bool>> filter, int pageIndex = 1, int pageSize = 10);
    Task<bool> AnyAsync(Expression<Func<T, bool>> filter);
    Task<bool> AnyAsync();
    Task<T> GetByIdAsync(object id);
    Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> filter);
    Task<int> CountAsync();
    Task<int> CountAsync(Expression<Func<T, bool>> filter);
    #endregion
    
    #region update
    void Update(T entity);
    void UpdateRange(IEnumerable<T> entities);
    #endregion
    
    #region delete
    void Delete(T entity);
    Task DeleteByIdAsync(object id);
    void DeleteRange(IEnumerable<T> entities);
    #endregion
}