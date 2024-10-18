using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;

namespace JobLink_Backend.Services.ServiceImpls;

public class JobServiceImpl(IUnitOfWork unitOfWork, IMapper mapper) : IJobService
{
    private IUnitOfWork _unitOfWork = unitOfWork;
    private IMapper _mapper = mapper;
    
    public async Task<JobDTO?> GetJobByIdAsync(Guid jobId)
    {
        var job = await _unitOfWork.Repository<Job>().FirstOrDefaultAsync(j => j.Id == jobId);
        return _mapper.Map<JobDTO>(job);
    }
}