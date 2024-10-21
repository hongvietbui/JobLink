using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;

namespace JobLink_Backend.Mappings;

public class UserProfile : MapProfile
{
    public UserProfile()
    {
        CreateMap<User, UserDTO>()
            .ForMember(dest => dest.RoleList, opt => opt.MapFrom(src => src.Roles.Select(r => r.Name).ToList()));
}
}