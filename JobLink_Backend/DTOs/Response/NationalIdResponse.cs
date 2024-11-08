namespace JobLink_Backend.DTOs.Response
{
	public class NationalIdResponse
	{
		public Guid userId { get; set; }
		public string NationalIdFrontUrl { get; set; }
		public string NationalIdBackUrl { get; set; }
	}
}
