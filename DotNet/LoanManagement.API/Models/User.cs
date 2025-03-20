using System.ComponentModel.DataAnnotations;

namespace LoanManagement.API.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }
        
        [Required]
        [MaxLength(100)]
        public string Name { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(255)]
        [EmailAddress]
        public string Email { get; set; } = string.Empty;
        
        [Required]
        [MaxLength(255)]
        public string Password { get; set; } = string.Empty;
        
        [Required]
        public UserRole Role { get; set; }
    }
    
    public enum UserRole
    {
        Admin,
        Borrower,
        LoanOfficer
    }
}