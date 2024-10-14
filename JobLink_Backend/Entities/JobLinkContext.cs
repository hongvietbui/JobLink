using Microsoft.EntityFrameworkCore;

namespace JobLink_Backend.Entities;

public class JobLinkContext : DbContext
{
    public JobLinkContext(DbContextOptions<JobLinkContext> options) : base(options)
    {
    }
    
    public DbSet<Job> Jobs { get; set; }
    public DbSet<Role> Roles { get; set; }
    public DbSet<User> Users { get; set; }
    
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Job>()
            .HasOne(j => j.Owner)
            .WithMany(u => u.OwnedJobs)
            .HasForeignKey(j => j.OwnerId)
            .OnDelete(DeleteBehavior.NoAction);
        
        modelBuilder.Entity<Job>()
            .HasOne(j => j.Worker)
            .WithMany(u => u.WorkedJobs)
            .HasForeignKey(j => j.WorkerId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<User>()
            .HasMany(u => u.Roles)
            .WithMany(r => r.Users)
            .UsingEntity(userRole => userRole.ToTable("UserRole"));
    }
}