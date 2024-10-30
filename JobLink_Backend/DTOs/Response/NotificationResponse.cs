namespace JobLink_Backend.DTOs.Response
{
    public class NotificationResponse
    {
        public Guid Id { get; set; }
        public string Message { get; set; }
        public DateTime Date { get; set; }
        public bool IsRead { get; set; }

    }
}
