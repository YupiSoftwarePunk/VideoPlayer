using Microsoft.EntityFrameworkCore;

namespace server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
        public DbSet<User> Users => Set<User>();
        public DbSet<Video> Videos => Set<Video>();
        public DbSet<Comment> Comments => Set<Comment>();
        public DbSet<Reaction> Reactions => Set<Reaction>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Entity<Reaction>()
            .HasIndex(r => new { r.UserId, r.VideoId })
            .IsUnique();

            modelBuilder.Entity<Video>()
                .HasOne(v => v.Author)
                .WithMany(u => u.Videos)
                .HasForeignKey(v => v.AuthorId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Comment>()
                .HasOne<Video>()
                .WithMany(v => v.Comments)
                .HasForeignKey(c => c.VideoId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<User>(entity =>
            {
                entity.HasIndex(u => u.Username).IsUnique();
                entity.Property(u => u.Username).IsRequired().HasMaxLength(50);
                entity.Property(u => u.Role).IsRequired().HasMaxLength(20);
            });

            modelBuilder.Entity<Video>(entity =>
            {
                entity.Property(v => v.Title).IsRequired().HasMaxLength(150);
                entity.Property(v => v.FileName).IsRequired();
            });
        }
    }
}
