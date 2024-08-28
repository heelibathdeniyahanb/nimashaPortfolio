using Microsoft.EntityFrameworkCore;
using Portfolio.Models;

namespace Portfolio.Data
{
    public class DatabaseContext : DbContext
    {
        public DatabaseContext(DbContextOptions<DatabaseContext> options) : base(options)
        {
        }

        public DbSet<Email> Emails { get; set; }
        public DbSet<Profile> Profiles { get; set; }
        public DbSet<Projects> Projects { get; set; }
        public DbSet<ProjectAttachment> ProjectAttachment { get; set; }
        public DbSet<BlogAttachment> BlogAttachment { get; set; }
        public DbSet<Blogs> Blogs { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Email Attachments Configuration
            modelBuilder.Entity<Email>()
                .HasMany(e => e.Attachments)
                .WithOne(a => a.Email)
                .HasForeignKey(a => a.EmailId);

            modelBuilder.Entity<Projects>()
               .HasMany(p => p.ProjectAttachments)
               .WithOne(a => a.Projects)
               .HasForeignKey(a => a.ProjectId);

            modelBuilder.Entity<Blogs>()
              .HasMany(b => b.BlogAttachments)
              .WithOne(a => a.Blogs)
              .HasForeignKey(a => a.BlogId);



            base.OnModelCreating(modelBuilder);
        }
    }
}
