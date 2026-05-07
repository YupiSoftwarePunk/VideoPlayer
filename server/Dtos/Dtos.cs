namespace server.Dtos.cs
{
    public class Dtos
    {
        public record RegisterDto(string Username, string Password);
        public record LoginDto(string Username, string Password);
        public record UploadVideoDto(string Title);
        public record CommentDto(string Text);
        public record ReactionDto(bool IsLike);
        public record RestrictionDto(bool IsRestricted, string? Reason);
    }
}
