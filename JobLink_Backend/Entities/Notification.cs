using JobLink_Backend.Utilities.BaseEntities;

namespace JobLink_Backend.Entities
{
	public class Notification:BaseEntity<Guid>
	{
		public Guid UserId { get; set; } 
		public string Message { get; set; }
		public DateTime Date { get; set; }
		public bool IsRead { get; set; }

		public User User { get; set; }
	}
}
