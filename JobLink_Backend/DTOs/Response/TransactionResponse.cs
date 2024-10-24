using JobLink_Backend.Entities;

namespace JobLink_Backend.DTOs.Response
{
    public class TransactionResponse
    {
        public decimal Amount { get; set; }           
        public PaymentType PaymentType { get; set; }  
        public PaymentStatus Status { get; set; }     
        public DateTime TransactionDate { get; set; } 
    }
}
