﻿using JobLink_Backend.Utilities.CustomDateTimeConverter;
using Newtonsoft.Json;

namespace JobLink_Backend.DTOs.All;

public class BankingTransactionDTO
{
    public int? Id { get; set; }
    public string? Tid { get; set; }
    public string? Description { get; set; }
    public decimal? Amount { get; set; }
    [JsonProperty("cusum_balance")]
    public decimal? CusumBalance { get; set; }
    [JsonProperty("when")]
    [JsonConverter(typeof(CustomDateTimeConverter))] 
    public DateTime? When { get; set; }
    [JsonProperty("bank_sub_acc_id")]
    public string? BankSubAccId { get; set; }
    public string? SubAccId { get; set; }
    public string? BankName { get; set; }
    public string? BankAbbreviation { get; set; }
    public string? VirtualAccount { get; set; }
    public string? VirtualAccountName { get; set; }
    public string? CorresponsiveName { get; set; }
    public string? CorresponsiveAccount { get; set; }
    public string? CorresponsiveBankId { get; set; }
    public string? CorresponsiveBankName { get; set; }
}