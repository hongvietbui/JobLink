using JobLink_Backend.Entities;

namespace JobLink_Backend.DTOs.All
{
    public class UserNationalIdDTO
    {
        public Guid UserId { get; set; }
        public string NationalIdFrontUrl { get; set; }
        public string NationalIdBackUrl { get; set; }
        public NationalIdStatus? NationalIdStatus { get; set; }
    }
}
