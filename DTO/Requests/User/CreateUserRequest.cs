
using System.ComponentModel.DataAnnotations;
using JwtDemo.Entities;

namespace JwtDemo.DTOs.Requests.User
{
   public class CreateUserRequest
   {
      [Required]
      public string FirstName { get; set; }
      [Required]
      public string LastName { get; set; }
      [Required]
      public string UserName { get; set; }
      [Required]
      [EmailAddress]
      public string Email { get; set; }
      [Required]
      [MinLength(6)]
      public string Password { get; set; }
      public int Type { get; set; }
   }
}