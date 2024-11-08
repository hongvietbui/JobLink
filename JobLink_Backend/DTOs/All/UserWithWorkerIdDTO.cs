namespace JobLink_Backend.DTOs.All
{
    public class UserWithWorkerIdDTO
    {
        public UserDTO User { get; set; }
        public Guid WorkerId { get; set; }
    }
}
