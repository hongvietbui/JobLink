using System.ComponentModel.DataAnnotations;

namespace JobLink_Backend.DTOs.Request;

public class PagingFilterBase
{
    [Range(1, int.MaxValue)] public int PageNumber { get; set; } = 1;
    [Range(1, 500)] public int PageSize { get; set; } = 10;
}