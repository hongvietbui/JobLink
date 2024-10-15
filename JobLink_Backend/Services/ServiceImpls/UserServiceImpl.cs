using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Repositories.RepositoryImpls;
using JobLink_Backend.Services.IServices;

namespace JobLink_Backend.Services.ServiceImpls;

public class UserServiceImpl(IUnitOfWork unitOfWork, IUserRepository userRepository) : IUserService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IUserRepository _userRepository = userRepository;

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

    public bool ChangePassword(int userId, string currentPassword, string newPassword)
    {
        var user = _userRepository.GetById(userId);
        if(user == null)
        {
            throw new Exception("User not found");
        }

        if(user.Password != currentPassword)
        {
            throw new Exception("Current password is incorrect");
        }

        user.Password = newPassword;
        _userRepository.Update(user);
        _userRepository.SaveChanges();

        return true;
    }
}