namespace JobLink_Backend.DTOs.Response
{
    public class JobAndOwnerDetailsResponse
    {
        public Guid JobId { get; set; }
        public string JobName { get; set; }
        public string Description { get; set; }
        public string? Avatar { get; set; }
        public int? Lat{ get; set; }
        public int? Lon { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
    }
}
