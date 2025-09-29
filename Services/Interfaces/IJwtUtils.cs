

using JwtDemo.Entities;

namespace JwtDemo.Services.Interfaces;

public interface IJwtUtils
{
    string GenerateJwtToken(User user, IList<string> roles);
    int? ValidateJwtToken(string? token);
    RefreshToken GenerateRefreshToken(string ipAddress);
}