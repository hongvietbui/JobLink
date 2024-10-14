using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Repositories.RepositoryImpls;
using JobLink_Backend.Services.IServices;

namespace JobLink_Backend.Services.ServiceImpls;

public class UserServiceImpl(IUnitOfWork unitOfWork, IMapper mapper, IUserRepository userRepository) : IUserService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IUserRepository _userRepository = userRepository;
    private readonly IMapper _mapper = mapper;
    
    public async Task SaveRefreshTokenAsync(string username, string refreshToken)
    {
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(x => x.Username == username);
        user.RefreshToken = refreshToken;
        _unitOfWork.Repository<User>().Update(user);
    }
    
    public async Task<User> LoginAsync(string username, string password)
    {
        var user = await _unitOfWork.Repository<User>().FirstOrDefaultAsync(u => u.Username == username && u.Password == password, u => u.Roles);
        return user;
    }

    public async Task<UserDTO> RegisterAsync(RegisterRequest request)
    {
        var roleList = new List<Role>();
        roleList.Add(await _unitOfWork.Repository<Role>().FirstOrDefaultAsync(r => r.Name == "JobOwner"));
        roleList.Add(await _unitOfWork.Repository<Role>().FirstOrDefaultAsync(r => r.Name == "Worker"));
        
        //check if the role 
        var newUser = new User
        {
            Id = Guid.NewGuid(),
            Username = request.Username,
            Password = request.Password,
            Email = request.Email,
            FirstName = request.FirstName,
            LastName = request.LastName,
            PhoneNumber = request.PhoneNumber,
            DateOfBirth = DateOnly.FromDateTime(request.DateOfBirth.Value),
            Address = request.Address,
            Roles = roleList,
            Status = UserStatus.PendingVerification
        };

        await _userRepository.AddAsync(newUser);
        await _unitOfWork.SaveChangesAsync();
        return _mapper.Map<UserDTO>(newUser);
    }
}