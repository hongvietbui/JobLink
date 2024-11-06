namespace JobLink_Backend.DTOs.Request
{
    public class NotificationRequest
    {
        public Guid UserId { get; set; }
        public string Message { get; set; }
    }
}
