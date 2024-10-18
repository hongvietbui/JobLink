using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;

namespace JobLink_Backend.Mappings;

public class JobProfile : MapProfile
{
    public JobProfile()
    {
        CreateMap<Job, JobDTO>().ReverseMap();
    }
}