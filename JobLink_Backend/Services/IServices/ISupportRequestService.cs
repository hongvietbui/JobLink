using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request.SupportRequests;
using JobLink_Backend.Entities;
using JobLink_Backend.Utilities.Pagination;

namespace JobLink_Backend.Services.IServices;

public interface ISupportRequestService
{
    Task<Pagination<SupportRequestDto>> GetAllSupportRequestsAsync(SupportRequestFilter filter);
    Task<SupportRequestDto> AddNewSupportRequestAsync(SupportRequestCreateDto data, string imageUrl, string accessToken);

    Task<SupportRequestDto> GetSupportRequestByIdAsync(Guid id);
    Task<SupportRequestDto> UpdateSupportRequestStatus(Guid id);
}