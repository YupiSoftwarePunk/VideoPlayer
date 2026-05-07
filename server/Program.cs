
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using server.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using static server.Dtos.cs.Dtos;

namespace server
{
    public class Program
    {
        public static void Main(string[] args)
        {
            DotNetEnv.Env.Load();

            var builder = WebApplication.CreateBuilder(args);

            var jwtKey = Environment.GetEnvironmentVariable("JWT_KEY")
                         ?? throw new Exception("JWT_KEY not found in .env");
            var connectionString = Environment.GetEnvironmentVariable("DB_CONNECTION")
                         ?? throw new Exception("DB_CONNECTION not found in .env");


            builder.Services.AddControllers();
            // Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
            builder.Services.AddOpenApi();


            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
            .AddJwtBearer(options => {
                options.TokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuer = false,
                    ValidateAudience = false,
                    ValidateLifetime = true,
                    IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
                };
            });
            builder.Services.AddAuthorization();

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(connectionString));

            builder.Services.AddCors(options => options.AddPolicy("AllowVite",
                p => p.WithOrigins("http://localhost:5173").AllowAnyMethod().AllowAnyHeader()));


            var app = builder.Build();

            app.UseCors("AllowVite");
            app.UseStaticFiles();


            var uploadPath = Path.Combine(app.Environment.WebRootPath ?? "wwwroot", "uploads");
            if (!Directory.Exists(uploadPath)) Directory.CreateDirectory(uploadPath);


            var auth = app.MapGroup("/auth");

            // Авторизация
            auth.MapPost("/register", async (RegisterDto dto, AppDbContext db) => {
                if (await db.Users.AnyAsync(u => u.Username == dto.Username)) return Results.BadRequest("User exists");

                var user = new User
                {
                    Username = dto.Username,
                    PasswordHash = BCrypt.Net.BCrypt.HashPassword(dto.Password),
                    Role = "User"
                };
                db.Users.Add(user);
                await db.SaveChangesAsync();
                return Results.Ok("Registered");
            });

            auth.MapPost("/login", async (LoginDto dto, AppDbContext db, IConfiguration config) => {
                var user = await db.Users.FirstOrDefaultAsync(u => u.Username == dto.Username);
                if (user == null || !BCrypt.Net.BCrypt.Verify(dto.Password, user.PasswordHash)) return Results.Unauthorized();

                var token = GenerateJwtToken(user, jwtKey);
                return Results.Ok(new { token });
            });


            // Видео
            var videos = app.MapGroup("/videos").RequireAuthorization();

            videos.MapGet("/", async (AppDbContext db) => {
                return await db.Videos
                    .Where(v => !v.IsRestricted)
                    .Select(v => new {
                        v.Id,
                        v.Title,
                        Url = $"/uploads/{v.FileName}",
                        Author = v.Author.Username,
                        Likes = v.Reactions.Count(r => r.IsLike),
                        Dislikes = v.Reactions.Count(r => !r.IsLike),
                        CommentsCount = v.Comments.Count
                    })
                    .ToListAsync();
            });

            videos.MapPost("/upload", async (HttpContext context, AppDbContext db, ClaimsPrincipal user) => {
                var form = await context.Request.ReadFormAsync();
                var file = form.Files.GetFile("video");
                var title = form["title"];

                if (file == null) return Results.BadRequest("No file");

                var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var path = Path.Combine("wwwroot/uploads", fileName);

                using var stream = new FileStream(path, FileMode.Create);
                await file.CopyToAsync(stream);

                var video = new Video { Title = title, FileName = fileName, AuthorId = userId };
                db.Videos.Add(video);
                await db.SaveChangesAsync();

                return Results.Ok(video);
            });

            // Лайки/Дизлайки
            videos.MapPost("/{id}/react", async (int id, ReactionDto dto, AppDbContext db, ClaimsPrincipal user) => {
                var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var existing = await db.Reactions.FirstOrDefaultAsync(r => r.VideoId == id && r.UserId == userId);

                if (existing != null)
                {
                    existing.IsLike = dto.IsLike;
                }
                else
                {
                    db.Reactions.Add(new Reaction { VideoId = id, UserId = userId, IsLike = dto.IsLike });
                }
                await db.SaveChangesAsync();
                return Results.Ok();
            });

            // Комментарии
            videos.MapPost("/{id}/comments", async (int id, CommentDto dto, AppDbContext db, ClaimsPrincipal user) => {
                var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                db.Comments.Add(new Comment { VideoId = id, UserId = userId, Text = dto.Text });
                await db.SaveChangesAsync();
                return Results.Ok();
            });

            videos.MapDelete("/{id}", async (int id, AppDbContext db, ClaimsPrincipal user) => {
                var video = await db.Videos.FindAsync(id);
                if (video == null) return Results.NotFound();

                var userId = int.Parse(user.FindFirst(ClaimTypes.NameIdentifier)!.Value);
                var userRole = user.FindFirst(ClaimTypes.Role)!.Value;

                if (video.AuthorId != userId && userRole != "Admin")
                    return Results.Forbid();

                var path = Path.Combine("wwwroot/uploads", video.FileName);
                if (File.Exists(path)) File.Delete(path);

                db.Videos.Remove(video);
                await db.SaveChangesAsync();
                return Results.NoContent();
            });


            // админка
            var admin = app.MapGroup("/admin").RequireAuthorization(policy => policy.RequireRole("Admin"));

            // Список видео конкретного пользователя
            admin.MapGet("/users/{userId}/videos", async (int userId, AppDbContext db) =>
                await db.Videos.Where(v => v.AuthorId == userId).ToListAsync());

            // Ограничение видео
            admin.MapPatch("/videos/{id}/restrict", async (int id, RestrictionDto dto, AppDbContext db) => {
                var video = await db.Videos.FindAsync(id);
                if (video == null) return Results.NotFound();

                video.IsRestricted = dto.IsRestricted;
                video.RestrictionReason = dto.Reason;
                await db.SaveChangesAsync();
                return Results.Ok("Status updated");
            });



            // Configure the HTTP request pipeline.
            if (app.Environment.IsDevelopment())
            {
                app.MapOpenApi();
            }

            app.UseAuthorization();


            app.MapControllers();


            app.Use(async (context, next) =>
            {
                try
                {
                    Console.WriteLine($"{context.Request.Method} {context.Request.Path}");
                    await next.Invoke();
                    Console.WriteLine($"{context.Response.StatusCode}");
                }
                catch (Exception ex)
                {
                    Console.WriteLine($"CRITICAL ERROR: {ex.Message}");
                    context.Response.StatusCode = 500;
                    await context.Response.WriteAsJsonAsync(new { error = "Internal Server Error" });
                }
            });

            app.Run();
        }

        private static string GenerateJwtToken(User user, string jwtKey)
        {
            var claims = new[]
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
                new Claim(ClaimTypes.Role, user.Role)
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: null,
                audience: null,
                claims: claims,
                expires: DateTime.UtcNow.AddDays(7),
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}