using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Repositories.RepositoryImpls;
using JobLink_Backend.Services.IServices;

namespace JobLink_Backend.Services.ServiceImpls;

public class UserServiceImpl(IUserRepository userRepository) : IUserService
{
    private readonly IUserRepository _userRepository = userRepository;
    
    public async Task SaveRefreshTokenAsync(string username, string refreshToken)
    {
        var user = await _userRepository.FirstOrDefaultAsync(x => x.Username == username);
        user.RefreshToken = refreshToken;
        _userRepository.Update(user);
    }
    
    public async Task<User> LoginAsync(string username, string password)
    {
        var user = await _userRepository.FirstOrDefaultAsync(x => x.Username == username && x.Password == password);
        return user;
    }
}