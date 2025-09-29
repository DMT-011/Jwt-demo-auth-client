
using JwtDemo.DTOs.Response;
using JwtDemo.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace JwtDemo.Authorization;

[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method)]
public class AuthorizeAttribute : Attribute, IAuthorizationFilter
{
    public string? Roles { get; set; }

    public void OnAuthorization(AuthorizationFilterContext context)
    {
        
        var allowAnonymous = context.ActionDescriptor.EndpointMetadata.OfType<AllowAnonymousAttribute>().Any();
        if (allowAnonymous) return;

        
        var user = (UserDto?)context.HttpContext.Items["User"];
        if (user == null)
        {
            context.Result = new JsonResult(new { message = "Unauthorized" }) 
            { 
                StatusCode = StatusCodes.Status401Unauthorized 
            };
            return;
        }

        
        if (!string.IsNullOrEmpty(Roles))
        {
            var requiredRoles = Roles.Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);
            var userRoles = user.Roles;

            if (!requiredRoles.Any(requiredRole => userRoles.Contains(requiredRole)))
            {
                context.Result = new JsonResult(new { message = "Forbidden" }) 
                { 
                    StatusCode = StatusCodes.Status403Forbidden 
                };
            }
        }
    }
}