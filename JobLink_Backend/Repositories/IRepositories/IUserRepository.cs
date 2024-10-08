using JobLink_Backend.Entities;

namespace JobLink_Backend.Repositories.IRepositories;

public interface IUserRepository : IRepository<User>
{
    User GetById(int userId);
    void Update(User user);
    void SaveChanges();
}