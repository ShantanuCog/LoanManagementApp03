using LoanManagement.API.Models;
using Microsoft.EntityFrameworkCore;

namespace LoanManagement.API.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options) : base(options)
        {
        }

        public DbSet<User> Users { get; set; } = null!;

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Configure User entity
            modelBuilder.Entity<User>()
                .HasIndex(u => u.Email)
                .IsUnique();

            // Seed admin user
            var adminId = Guid.NewGuid();
            modelBuilder.Entity<User>().HasData(
                new User
                {
                    Id = adminId,
                    Name = "Admin User",
                    Email = "admin@loanmanagement.com",
                    // Using BCrypt to hash the password "SafePassword123"
                    Password = BCrypt.Net.BCrypt.HashPassword("SafePassword123"),
                    Role = UserRole.Admin
                }
            );
        }
    }
}