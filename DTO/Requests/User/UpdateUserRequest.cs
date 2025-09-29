
using System.ComponentModel.DataAnnotations;

namespace JwtDemo.DTOs.Requests.User
{
   public class UpdateUserRequest
   {
      public string? FirstName { get; set; }
      public string? LastName { get; set; }

      [EmailAddress]
      public string? Email { get; set; }

      [MinLength(6)]
      public string? Password { get; set; }
      public List<string>? Roles { get; set; }
   }
}