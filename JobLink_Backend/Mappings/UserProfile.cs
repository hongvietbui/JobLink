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
            .ForMember(dto => dto.Status, opt => opt.MapFrom(src => src.Status.GetStringValue()))
            .ReverseMap()
            .ForMember(u => u.Status, opt => opt.MapFrom(src => src.Status.GetEnumValue<UserStatus>()));
    }
}