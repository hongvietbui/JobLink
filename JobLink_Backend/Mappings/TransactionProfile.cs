using JobLink_Backend.DTOs.Request.Transactions;
using JobLink_Backend.DTOs.Response.Transactions;
using JobLink_Backend.Entities;

namespace JobLink_Backend.Mappings;

public class TransactionProfile: MapProfile
{
    public TransactionProfile()
    {
        CreateMap<Transactions, TransactionDTO>().ReverseMap();
        CreateMap<Transactions, TransactionCreateDto>().ReverseMap();
        
    }
}