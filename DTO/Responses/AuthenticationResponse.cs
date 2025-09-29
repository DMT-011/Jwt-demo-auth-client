
using JwtDemo.Entities;

namespace JwtDemo.DTOs.Response;

public class AuthenticationResponse
{
   public int Id { get; set; }
    public string FirstName { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string JwtToken { get; set; }
    public string RefreshToken { get; set; }

    public AuthenticationResponse(User user, string jwtToken, string refreshToken)
    {
        Id = user.Id;
        FirstName = user.FirstName;
        LastName = user.LastName;
        UserName = user.UserName;
        Email = user.Email;
        JwtToken = jwtToken;
        RefreshToken = refreshToken;
    }}