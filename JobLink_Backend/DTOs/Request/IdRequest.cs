namespace JobLink_Backend.DTOs.Request
{
    public class IdRequest
    {
        public Guid userId {  get; set; }
        public IFormFile NationalIdFront { get; set; }
        public IFormFile NationalIdBack { get; set; }
    }
}
