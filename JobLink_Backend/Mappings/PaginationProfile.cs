using JobLink_Backend.Utilities.Pagination;

namespace JobLink_Backend.Mappings;

public class PaginationProfile : MapProfile
{
    public PaginationProfile()
    {
        CreateMap(typeof(Pagination<>), typeof(Pagination<>));
    }
}