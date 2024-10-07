using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Repositories.RepositoryImpls;
using JobLink_Backend.Services.IServices;

namespace JobLink_Backend.Services.ServiceImpls;

public class UserServiceImpl(IUnitOfWork unitOfWork) : IUserService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    
    public async Task SaveRefreshTokenAsync(string username, string refreshToken)
    {
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Username == username);
        user.RefreshToken = refreshToken;
        _unitOfWork.Repository<User>().Update(user);
    }
    
    public async Task<User> LoginAsync(string username, string password)
    {
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(u => u.Username == username && u.Password == password, u => u.Role);
        return user;
    }
}