using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;

namespace JobLink_Backend.Mappings;

public class RoleProfile : MapProfile
{
    public RoleProfile()
    {
        CreateMap<Role, RoleDTO>().ReverseMap();
    }
}