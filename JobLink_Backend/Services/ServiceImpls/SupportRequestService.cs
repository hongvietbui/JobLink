using AutoMapper;
using JobLink_Backend.DTOs.Request.SupportRequests;
using JobLink_Backend.Repositories.IRepositories;
using JobLink_Backend.Services.IServices;

namespace JobLink_Backend.Services.ServiceImpls;

public class SupportRequestService(
    IUnitOfWork unitOfWork,
    IMapper mapper) : ISupportRequestService
{
    private readonly IUnitOfWork _unitOfWork = unitOfWork;
    private readonly IMapper _mapper = mapper;


    public async Task AddNewTransactionAsync(SupportRequestCreateDto supportRequestCreate)
    {
    }
}