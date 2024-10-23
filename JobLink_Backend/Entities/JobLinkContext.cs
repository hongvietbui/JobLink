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
    public DbSet<Review> Reviews { get; set; }

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

        modelBuilder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany(u => u.Notifications)
            .HasForeignKey(n => n.UserId);

        modelBuilder.Entity<Transactions>()
            .HasOne(t => t.User)
            .WithMany(u => u.UserTransactions)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Worker)
            .WithMany(r => r.WorkerReviews)
            .HasForeignKey(r => r.WorkerId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Owner)
            .WithMany(r => r.OwnerReviews)
            .HasForeignKey(r => r.OwnerId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Job)
            .WithMany(r => r.JobReview)
            .HasForeignKey(r => r.JobId)
            .OnDelete(DeleteBehavior.NoAction);
    }


}