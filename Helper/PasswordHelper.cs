

using System.Security.Cryptography;
using System.Text;
namespace JwtDemo.Helpers;

public static class PasswordHelper
{
   private const int SaltSize = 16;
   private const int HashSize = 20;
   private const int Iterations = 10000;

   public static void CreatePasswordHash(string password, out byte[] passwordHash, out byte[] passwordSalt)
   {
      using (var hmac = new HMACSHA512())
      {
         passwordSalt = hmac.Key;
         passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
      }

   }

   public static bool VerifyPasswordHash(string password, byte[] storedHash, byte[] storedSalt)
   {
      using (var hmac = new HMACSHA512(storedSalt))
      {
         var computedHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));

         return computedHash.SequenceEqual(storedHash);
      }
   }
}