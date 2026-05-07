namespace server.Data
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; } = string.Empty;
        public string PasswordHash { get; set; } = string.Empty;

        public string Role { get; set; } = "User";

        public List<Video> Videos { get; set; } = new();
    }

    public class Video
    {
        public int Id { get; set; }
        public string Title { get; set; } = string.Empty;
        public string FileName { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public bool IsRestricted { get; set; } = false;
        public string? RestrictionReason { get; set; }

        public int AuthorId { get; set; }
        public User Author { get; set; } = null!;

        public List<Comment> Comments { get; set; } = new();
        public List<Reaction> Reactions { get; set; } = new();
    }

    public class Comment
    {
        public int Id { get; set; }
        public string Text { get; set; } = string.Empty;
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public int VideoId { get; set; }
        public int UserId { get; set; }
        public User User { get; set; } = null!;
    }

    public class Reaction
    {
        public int Id { get; set; }
        public int UserId { get; set; }
        public int VideoId { get; set; }

        // true = Like, false = Dislike
        public bool IsLike { get; set; }
    }
}
