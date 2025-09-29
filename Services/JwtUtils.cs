

using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using JwtDemo.Entities;
using JwtDemo.Services.Interfaces;
using Microsoft.IdentityModel.Tokens;

namespace JwtDemo.Services;

public class JwtUtils : IJwtUtils
{
   private readonly IConfiguration _configuration;

   public JwtUtils(IConfiguration configuration)
   {
      _configuration = configuration;
   }

   public string GenerateJwtToken(User user, IList<string> roles)
   {
      var claims = new List<Claim>
      {
         new Claim("id", user.Id.ToString())
      };

      claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

      var tokenHandle = new JwtSecurityTokenHandler();
      var key = Encoding.ASCII.GetBytes(_configuration["AppSettings:Secret"]!);
      var tokenDescriptor = new SecurityTokenDescriptor
      {
         Subject = new ClaimsIdentity(claims),
         Expires = DateTime.UtcNow.AddDays(1),
         SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
      };
      var token = tokenHandle.CreateToken(tokenDescriptor);
      return tokenHandle.WriteToken(token);
   }

   public int? ValidateJwtToken(string? token)
   {
      if (token == null)
         return null;

      var tokenHandler = new JwtSecurityTokenHandler();
      var key = Encoding.ASCII.GetBytes(_configuration["AppSettings:Secret"]!);
      try
      {
         tokenHandler.ValidateToken(token, new TokenValidationParameters
         {
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(key),
            ValidateIssuer = false,
            ValidateAudience = false,
            ClockSkew = TimeSpan.Zero
         }, out SecurityToken validatedToken);

         var jwtToken = (JwtSecurityToken)validatedToken;
         var userId = int.Parse(jwtToken.Claims.First(x => x.Type == "id").Value);

         return userId;
      }
      catch
      {
         return null;
      }

   }
   public RefreshToken GenerateRefreshToken(string ipAddress)
   {
      var refreshToken = new RefreshToken
      {
         Token = Convert.ToBase64String(RandomNumberGenerator.GetBytes(64)),
         Expires = DateTime.UtcNow.AddDays(7),
         Created = DateTime.UtcNow,
         CreatedByIp = ipAddress
      };

      return refreshToken;
   }
}