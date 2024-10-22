using JobLink_Backend.Utilities;

namespace JobLink_Backend.Entities;

public enum PaymentType
{
    // Rut tien
    [StringValue("Withdraw")]
    Withdraw,
    // Nap tien
    [StringValue("Deposit")]
    Deposit 
}