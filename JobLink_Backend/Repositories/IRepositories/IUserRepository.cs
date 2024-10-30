using JobLink_Backend.Entities;

namespace JobLink_Backend.Repositories.IRepositories;

public interface IUserRepository : IRepository<User>
{
    Task AddAsync(User user, List<string> roleNames);
    Task<User> GetById(Guid userId);
    Task Update(User user);
    Task SaveChangeAsync();
}