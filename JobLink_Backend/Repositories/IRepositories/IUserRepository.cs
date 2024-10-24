using JobLink_Backend.Entities;

namespace JobLink_Backend.Repositories.IRepositories;

public interface IUserRepository : IRepository<User>
{
    Task<User> GetById(Guid userId);
    Task Update(User user);
    Task SaveChangeAsync();
}