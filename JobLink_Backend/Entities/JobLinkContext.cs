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
    public DbSet<SupportRequest> SupportRequests { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.Entity<Job>()
            .HasOne(j => j.Owner)
            .WithMany(jo => jo.OwnedJobs)
            .HasForeignKey(j => j.OwnerId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<JobWorker>()
            .HasKey(jw => new {jw.JobId, jw.WorkerId});
        
        modelBuilder.Entity<JobWorker>()
            .HasOne(jw => jw.Job)
            .WithMany(j => j.JobWorkers)
            .HasForeignKey(jw => jw.JobId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<JobWorker>()
            .HasOne(jw => jw.Worker)
            .WithMany(w => w.JobWorkers)
            .HasForeignKey(jw => jw.WorkerId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<User>()
            .HasMany(u => u.Roles)
            .WithMany(r => r.Users)
            .UsingEntity(userRole => userRole.ToTable("UserRole"));
        
        modelBuilder.Entity<Worker>()
            .HasOne(jo => jo.User)
            .WithOne()
            .HasForeignKey<Worker>(jo => jo.UserId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<Worker>()
            .HasMany(w => w.JobWorkers)
            .WithOne(jw => jw.Worker)
            .HasForeignKey(jw => jw.WorkerId)
            .OnDelete(DeleteBehavior.Cascade);
        
        modelBuilder.Entity<JobOwner>()
            .HasOne(jo => jo.User)
            .WithOne()
            .HasForeignKey<JobOwner>(jo => jo.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        modelBuilder.Entity<Notification>()
            .HasOne(n => n.User)
            .WithMany(u => u.Notifications)
            .HasForeignKey(n => n.UserId);
        
        modelBuilder.Entity<Review>()
            .HasOne(r => r.Worker)
            .WithMany(w => w.WorkerReviews)
            .HasForeignKey(r => r.WorkerId)
            .OnDelete(DeleteBehavior.NoAction);
        
        modelBuilder.Entity<Review>()
            .HasOne(r => r.Owner)
            .WithMany(o => o.OwnerReviews) 
            .HasForeignKey(r => r.OwnerId)
            .OnDelete(DeleteBehavior.NoAction);
        
        modelBuilder.Entity<Review>()
            .HasOne(r => r.Job)
            .WithMany(j => j.Reviews)
            .HasForeignKey(r => r.JobId)
            .OnDelete(DeleteBehavior.NoAction);

        modelBuilder.Entity<Review>()
            .HasOne(r => r.Job)
            .WithMany(r => r.Reviews)
            .HasForeignKey(r => r.JobId)
            .OnDelete(DeleteBehavior.NoAction);
        
        modelBuilder.Entity<SupportRequest>()
            .HasOne(t => t.User)
            .WithMany(u => u.UserSystemRequest)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict);
        
        modelBuilder.Entity<SupportRequest>()
            .HasOne(t => t.Job)
            .WithMany(u => u.SupportRequests)
            .HasForeignKey(t => t.UserId)
            .OnDelete(DeleteBehavior.Restrict);
    }
}