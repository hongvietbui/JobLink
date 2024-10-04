using System.ComponentModel.DataAnnotations;
using JobLink_Backend.Utilities.BaseEntities;

namespace JobLink_Backend.Entities;

public class Role : BaseEntity<Guid>
{
    [Required]
    public string Name { get; set; }
}