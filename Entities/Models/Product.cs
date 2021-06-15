using System;
using System.ComponentModel.DataAnnotations;

namespace Entities.Models
{
    public class Product
    {
        public Guid Id { get; set; }
        
        [Required(ErrorMessage = "Product name cannot be empty")]
        public string Name { get; set; }
    }
}
