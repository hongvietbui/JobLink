using JobLink_Backend.Entities;

namespace JobLink_Backend.DTOs.Request
{
    public class TransactionsRequest
    {
        public Guid UserId { get; set; }
        public DateTime FromDate { get; set; }
        public DateTime? ToDate { get; set; }
        public PaymentType PaymentType { get; set; }
    }
}
