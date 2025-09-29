

using JwtDemo.Entities;
using Microsoft.AspNetCore.Mvc;
using JwtDemo.DTOs.Response;

namespace JwtDemo.Controllers;

[ApiController]
[Route("api/[controller]")]

public abstract class ApiController : ControllerBase
{

   public UserDto? CurrentUser => HttpContext.Items["User"] as UserDto;
}