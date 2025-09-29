
using Microsoft.EntityFrameworkCore;

namespace JwtDemo.Entities;


[Owned]
public class User
{
   public int Id { get; set; }
   public string? Email { get; set; }
   public string UserName { get; set; }
   public byte[] PasswordSalt { get; set; }
   public byte[] PasswordHash { get; set; }
   public string FirstName { get; set; }
   public string LastName { get; set; }
   public string? PhoneNumber { get; set; }
   public bool IsVerified { get; set; }
   public EUserType Type { get; set; }
   public List<RefreshToken> RefreshTokens { get; set; }
   public List<UserRole> UserRoles { get; set; } = new List<UserRole>();
}
