using JobLink_Backend.DTOs.All;
using JobLink_Backend.Entities;

namespace JobLink_Backend.Mappings;

public class ConversationProfile : MapProfile
{
    public ConversationProfile()
    {
        CreateMap<ConversationDto, Conversation>()
            .ReverseMap();
    }
}