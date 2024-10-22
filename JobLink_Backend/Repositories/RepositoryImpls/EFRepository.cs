using System.Linq.Expressions;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Utilities.Pagination;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;

namespace JobLink_Backend.Repositories.RepositoryImpls;

public class EFRepository<T> : IRepository<T> where T : class
{
    private readonly DbContext _context;
    private readonly DbSet<T> _dbSet;

    public EFRepository(DbContext context)
    {
        _context = context;
        _dbSet = _context.Set<T>();
    }

    public virtual async Task AddAsync(T entity)
    {
        await _dbSet.AddAsync(entity);
    }

    public async Task AddRangeAsync(IEnumerable<T> entities)
    {
        await _dbSet.AddRangeAsync(entities);
    }

    public async Task<IEnumerable<T>> GetAllAsync()
    {
        return await _dbSet.ToListAsync();
    }

    public IQueryable<T> GetAll()
    {
        return _dbSet;
    }

    public IQueryable<T> GetAll(Expression<Func<T, bool>> filter = null, params Expression<Func<T, object>>[] includes)
    {
        IQueryable<T> query = _dbSet;
        
        if (includes != null)
        {
            foreach (var include in includes)
            {
                query = query.Include(include);
            }
        }
        
        if (filter != null)
        {
            query = query.Where(filter);
        }

        return query.AsNoTracking();
    }

    public async Task<Pagination<T>> GetAllAsync(int pageIndex = 1, int pageSize = 10)
    {
        var itemCount = await _dbSet.CountAsync();
        var item = await _dbSet
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();

        return new Pagination<T>()
        {
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = itemCount,
            Items = item
        };
    }
    
    public async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> filter)
    {
        return await _dbSet.Where(filter).ToListAsync();
    }

    public async Task<Pagination<T>> GetAllAsync(Expression<Func<T, bool>> filter, int pageIndex = 1, int pageSize = 10)
    {
        var itemCount = await _dbSet.CountAsync(filter);
        var item = await _dbSet
            .Where(filter)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();

        return new Pagination<T>()
        {
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = itemCount,
            Items = item
        };
    }
    
    public async Task<bool> AnyAsync(Expression<Func<T, bool>> filter)
    {
        return await _dbSet.AnyAsync(filter);
    }

    public async Task<bool> AnyAsync()
    {
        return await _dbSet.AnyAsync();
    }

    public async Task<T> GetByIdAsync(object id)
    {
        return (await _dbSet.FindAsync(id))!;
    }

    public async Task<T> FirstOrDefaultAsync(Expression<Func<T, bool>> filter)
    {
        return (await _dbSet.IgnoreQueryFilters()
            .AsNoTracking()
            .FirstOrDefaultAsync(filter))!;
    }

    public async Task<IEnumerable<T>?> FindByConditionAsync(Expression<Func<T, bool>> filter, Func<IQueryable<T>, IOrderedQueryable<T>> orderBy, Func<IQueryable<T>, IIncludableQueryable<T, object>> include, bool disableTracking = true)
    {
        IQueryable<T> query = _dbSet;
        
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }
        
        if (include != null)
        {
            query = include(query);
        }
        
        if (orderBy != null)
        {
            query = orderBy(query);
        }

        return await query.Where(filter).ToListAsync();
    }

    public async Task<IEnumerable<T>?> FirstOrDefaultCondition(Expression<Func<T, bool>> filter, Func<IQueryable<T>, IIncludableQueryable<T, object>> include, bool disableTracking = true)
    {
        IQueryable<T> query = _dbSet;
        
        if (disableTracking)
        {
            query = query.AsNoTracking();
        }
        
        if (include != null)
        {
            query = include(query);
        }

        return await query.Where(filter).ToListAsync();
    }
    public async Task<int> CountAsync()
    {
        return await _dbSet.CountAsync();
    }

    public async Task<int> CountAsync(Expression<Func<T, bool>> filter)
    {
        return await _dbSet.CountAsync(filter);
    }

    public void Update(T entity)
    {
        _dbSet.Update(entity);
    }

    public void UpdateRange(IEnumerable<T> entities)
    {
        _dbSet.UpdateRange(entities);
    }

    public void Delete(T entity)
    {
        _dbSet.Remove(entity);
    }

    public async Task DeleteByIdAsync(object id)
    {
        var entity = await GetByIdAsync(id);
        if (entity != null)
        {
            _dbSet.Remove(entity);
        }
    }

    public void DeleteRange(IEnumerable<T> entities)
    {
        _dbSet.RemoveRange(entities);
    }
    
    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }
    
    public void SaveChanges()
    {
        _context.SaveChanges();
    }
    
    public void Dispose()
    {
        _context.Dispose();
    }
}