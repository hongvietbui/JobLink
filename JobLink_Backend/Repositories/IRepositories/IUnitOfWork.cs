using System.Linq.Expressions;
using JobLink_Backend.Utilities.Pagination;

namespace JobLink_Backend.Repositories.IRepositories;

public interface IUnitOfWork<T> where T : class
{
    #region Add

    public Task AddAsync(T entity);
    
    public Task AddRangeAsync(IEnumerable<T> entities);

    #endregion

    #region Read

    public Task<IEnumerable<T>> GetAllAsync();
    
    public IQueryable<T> GetAll();
    
    public Task<Pagination<T>> GetAllAsync(int pageIndex = 1, int pageSize = 10);
    
    public Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> filter);
    
    public Task<Pagination<T>> GetAllAsync(Expression<Func<T, bool>> filter, int pageIndex = 1, int pageSize = 10);
    
    public Task<bool> AnyAsync(Expression<Func<T, bool>> filter);
    
    public Task<bool> AnyAsync();

    public Task<T> GetByIdAsync(object id);
    
    public Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> filter);
    
    public Task<int> CountAsync();
    
    public Task<int> CountAsync(Expression<Func<T, bool>> filter);

    #endregion

    #region update

    public void Update(T entity);
    
    public void UpdateRange(IEnumerable<T> entities);

    #endregion

    #region delete

    public void Delete(T entity);
    
    public Task DeleteByIdAsync(object id);
    
    public void DeleteRange(IEnumerable<T> entities);

    #endregion
    
    public Task SaveChangesAsync();

    public Task<Pagination<T>> ToPagination(int pageIndex = 1, int pageSize = 10);
}