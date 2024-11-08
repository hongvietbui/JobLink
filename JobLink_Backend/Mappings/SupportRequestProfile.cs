using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Request.SupportRequests;
using JobLink_Backend.Entities;
using JobLink_Backend.Utilities;

namespace JobLink_Backend.Mappings;

public class SupportRequestProfile : MapProfile
{
    public SupportRequestProfile()
    {
        CreateMap<SupportRequestCreateDto, SupportRequest>()
            .ReverseMap();

        CreateMap<SupportRequestDto, SupportRequest>()
            .ReverseMap();
    }
}