using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;
using JobLink_Backend.Utilities;

namespace JobLink_Backend.Mappings;

public class JobProfile : MapProfile
{
    public JobProfile()
    {
        CreateMap<JobDTO, Job>()
            .ForMember(j => j.Status, opt => opt.MapFrom(src => src.Status.GetEnumValue<JobStatus>()))
            .ReverseMap()
            .ForMember(dto => dto.Status, opt => opt.MapFrom(src => src.Status.GetStringValue()));
    }
}