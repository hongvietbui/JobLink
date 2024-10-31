namespace JobLink_Backend.DTOs.Request
{
    public class ChatDTOReq
    {
        //SenderId must be JobOwnerId or WorkerId, not UserId!!!!
        public string? SenderId { get; set; }
        public string? ReceiverId { get; set; }
        public string? Message { get; set; }
        public string? JobId { get; set; }
        public bool IsWorker { get; set; }
    }
}
