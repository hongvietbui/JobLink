using System.Linq.Expressions;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Utilities.Pagination;
using Microsoft.EntityFrameworkCore;

namespace JobLink_Backend.Repositories.RepositoryImpls;

public class UnitOfWork(DbContext context) : IUnitOfWork
{
    private readonly DbContext _context = context;
    
    // Using a dictionary to store repositories
    private readonly Dictionary<Type, object> _repositories = new();

    // Implement IRepository method
    public IRepository<T> Repository<T>() where T : class
    {
        // Check if repository exists
        if (_repositories.ContainsKey(typeof(T)))
        {
            return (IRepository<T>)_repositories[typeof(T)];
        }

        // Create a new repository
        var repository = new EFRepository<T>(_context);
        _repositories.Add(typeof(T), repository);
        return repository;
    }

    // Implement SaveChangesAsync method
    public async Task SaveChangesAsync()
    {
        await _context.SaveChangesAsync();
    }

    // Implement SaveChanges method
    public void SaveChanges()
    {
        _context.SaveChanges();
    }

    // Implement Dispose method
    public void Dispose()
    {
        _context.Dispose();
    }
}