using JwtDemo.Services.Interfaces;
using Microsoft.AspNetCore.Http;
using System.Linq;
using System.Threading.Tasks;

namespace JwtDemo.Authorization
{
    public class JwtMiddleware
    {
        private readonly RequestDelegate _next;

        public JwtMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task Invoke(HttpContext context, IIdentityService identityService, IJwtUtils jwtUtils)
        {
            var token = context.Request.Headers["Authorization"].FirstOrDefault()?.Split(" ").Last();
            var userId = jwtUtils.ValidateJwtToken(token);
            if (userId != null)
            {
                // Gán user vào context nếu xác thực jwt thành công
                context.Items["User"] = await identityService.GetUserById(userId.Value);
            }

            await _next(context);
        }
    }
}