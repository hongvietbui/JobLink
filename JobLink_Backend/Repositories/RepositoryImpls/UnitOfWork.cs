using System.Linq.Expressions;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Utilities.Pagination;
using Microsoft.EntityFrameworkCore;

namespace JobLink_Backend.Repositories.RepositoryImpls;

public class UnitOfWork<T>(JobLinkContext context) : IUnitOfWork<T> where T : class
{
    private readonly JobLinkContext _context = context;
    private readonly DbSet<T> _dbSet = context.Set<T>();
    
    public async Task AddAsync(T entity)
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

    public async Task<Pagination<T>> GetAllAsync(int pageIndex = 1, int pageSize = 10)
    {
        var itemCount = await _dbSet.CountAsync();
        var item = await _dbSet
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();

        var result = new Pagination<T>()
        {
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = itemCount,
            Items = item
        };

        return result;
    }

    public async Task<IEnumerable<T>> GetAllAsync(Expression<Func<T, bool>> filter)
    {
        return await _dbSet.Where(filter).ToListAsync();
    }

    public async Task<Pagination<T>> GetAllAsync(Expression<Func<T, bool>> filter, int pageIndex = 1, int pageSize = 10)
    {
        var itemCount = await _dbSet.CountAsync();
        var item = await _dbSet.Where(filter)
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();

        var result = new Pagination<T>()
        {
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = itemCount,
            Items = item
        };

        return result;
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

    public async Task<Pagination<T>> ToPagination(int pageIndex = 1, int pageSize = 10)
    {
        var itemCount = await _dbSet.CountAsync();
        var item = await _dbSet
            .Skip((pageIndex - 1) * pageSize)
            .Take(pageSize)
            .AsNoTracking()
            .ToListAsync();
        
        var result = new Pagination<T>()
        {
            PageIndex = pageIndex,
            PageSize = pageSize,
            TotalItems = itemCount,
            Items = item
        };
        return result;
    }
}