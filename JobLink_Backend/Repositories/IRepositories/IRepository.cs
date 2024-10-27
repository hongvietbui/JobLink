using System.Linq.Expressions;
using JobLink_Backend.Utilities.Pagination;
using Microsoft.EntityFrameworkCore.Query;

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
    IQueryable<T> GetAll(Expression<Func<T, bool>> filter = null, params Expression<Func<T, object>>[] includes);
    Task<Pagination<T>> GetAllAsync(int pageIndex = 1, int pageSize = 10);
    Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> filter);
    Task<Pagination<T>> GetAllAsync(Expression<Func<T, bool>> filter, int pageIndex = 1, int pageSize = 10);

    Task<Pagination<T>> GetAllAsync(Expression<Func<T, bool>> filter, int pageIndex = 1, int pageSize = 10,
        Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null, bool disableTracking = true);

    Task<bool> AnyAsync(Expression<Func<T, bool>> filter);
    Task<bool> AnyAsync();
    Task<T> GetByIdAsync(object id);
    Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> filter);

    Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> filter,
        Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null, bool disableTracking = true);

    Task<IEnumerable<T>?> FindByConditionAsync(Expression<Func<T, bool>> filter = null,
        Func<IQueryable<T>, IOrderedQueryable<T>> orderBy = null,
        Func<IQueryable<T>, IIncludableQueryable<T, object>> include = null, bool disableTracking = true);

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