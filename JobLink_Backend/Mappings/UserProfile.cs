using AutoMapper;
using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;
using JobLink_Backend.Utilities;

namespace JobLink_Backend.Mappings;

public class UserProfile : MapProfile
{
    public UserProfile()
    {
        CreateMap<User, UserDTO>()
            .ForMember(dto => dto.RoleList, opt => opt.MapFrom(src => src.Roles.Select(r => r.Name).ToList()))
            .ForMember(dto => dto.Status, opt => opt.MapFrom(src => src.Status.GetStringValue()))
            .ReverseMap()
            .ForMember(u => u.Status, opt => opt.MapFrom(src => src.Status.GetEnumValue<UserStatus>()));
    }
}