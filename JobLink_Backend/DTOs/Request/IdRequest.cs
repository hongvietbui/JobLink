namespace JobLink_Backend.DTOs.Request
{
    public class IdRequest
    {
        public IFormFile NationalIdFront { get; set; }
        public IFormFile NationalIdBack { get; set; }
    }
}
