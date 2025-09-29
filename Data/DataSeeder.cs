using JwtDemo.Entities;
using JwtDemo.Helpers;

namespace JwtDemo.Data;

public static class DataSeeder
{
    public static void Seed(ApplicationDbContext context)
    {
        SeedRoles(context);
        SeedUsers(context);
        SeedUserRoles(context);
    }

    private static void SeedRoles(ApplicationDbContext context)
    {
        if (context.Roles.Any()) return;

        var roles = new List<Role>
        {
            new Role { Name = "Admin" },
            new Role { Name = "User" }
        };

        context.Roles.AddRange(roles);
        context.SaveChanges();
    }

    private static void SeedUsers(ApplicationDbContext context)
    {
        if (context.Users.Any()) return;

        PasswordHelper.CreatePasswordHash("Admin123", out byte[] adminPasswordHash, out byte[] adminPasswordSalt);
        var adminUser = new User
        {
            FirstName = "Admin",
            LastName = "User",
            Email = "admin@example.com",
            UserName = "admin",
            PasswordHash = adminPasswordHash,
            PasswordSalt = adminPasswordSalt,
            Type = EUserType.Admin,
            IsVerified = true
        };

        PasswordHelper.CreatePasswordHash("User123", out byte[] userPasswordHash, out byte[] userPasswordSalt);
        var normalUser = new User
        {
            FirstName = "Normal",
            LastName = "User",
            Email = "user@example.com",
            UserName = "user",
            PasswordHash = userPasswordHash,
            PasswordSalt = userPasswordSalt,
            Type = EUserType.User,
            IsVerified = true
        };

        context.Users.AddRange(adminUser, normalUser);
        context.SaveChanges();
    }

    private static void SeedUserRoles(ApplicationDbContext context)
    {
        if (context.Set<UserRole>().Any()) return;

        var adminUser = context.Users.SingleOrDefault(u => u.UserName == "admin");
        var normalUser = context.Users.SingleOrDefault(u => u.UserName == "user");

        var adminRole = context.Roles.SingleOrDefault(r => r.Name == "Admin");
        var userRole = context.Roles.SingleOrDefault(r => r.Name == "User");

        if (adminUser != null && adminRole != null && normalUser != null && userRole != null)
        {
            var userRoles = new List<UserRole>
            {
                new UserRole { User = adminUser, Role = adminRole },
                new UserRole { User = normalUser, Role = userRole }
            };

            context.Set<UserRole>().AddRange(userRoles);
            context.SaveChanges();
        }
    }
}