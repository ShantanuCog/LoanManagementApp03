using System.ComponentModel.DataAnnotations;

namespace LoanManagement.API.Models
{
    public class User
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        [StringLength(100)]
        public string Name { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
        [EmailAddress]      // similar to the DateTime attribute from SME sessions
        public string Email { get; set; } = string.Empty;

        [Required]
        [StringLength(255)]
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