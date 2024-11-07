using JobLink_Backend.DTOs.Request.SupportRequests;

namespace JobLink_Backend.Services.IServices;

public interface ISupportRequestService
{
    Task AddNewTransactionAsync(SupportRequestCreateDto supportRequestCreate);
    // Task<TransactionDTO?> GetTransactionByIdAsync(Guid transactionId);
}