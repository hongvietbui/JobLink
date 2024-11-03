namespace JobLink_Backend.DTOs.Response
{
    public class ChatDTOResp
    {
        public string? SenderId { get; set; }
        public string? ReceiverId { get; set; }
        public string? JobId { get; set; }
        
        public string? Message { get; set; }
    }
}
