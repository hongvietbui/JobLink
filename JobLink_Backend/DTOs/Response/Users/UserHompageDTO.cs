using JobLink_Backend.DTOs.All;
using JobLink_Backend.DTOs.Response.Transactions;

namespace JobLink_Backend.DTOs.Response.Users;

public class UserHompageDTO
{
    public Guid Id { get; set; }
    public int Ammount { get; set; }
    public int TotalWidthdraw { get; set; }

    public IEnumerable<JobDTO> Type { get; set; }
    public IEnumerable<TransactionDTO> NearTransactionDtos { get; set; }
}