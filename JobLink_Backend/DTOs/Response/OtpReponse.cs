namespace JobLink_Backend.DTOs.Response
{
    public class OtpReponse
    {
        public string Email { get; set; }
        public string Code { get; set; }
        public DateTime ExpiryTime { get; set; }
    }
}
