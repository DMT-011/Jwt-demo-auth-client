using System.Security.Principal;
using JwtDemo.Authorization;
using JwtDemo.DTOs.Requests.User;
using JwtDemo.Entities;
using JwtDemo.Services.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace JwtDemo.Controllers
{
   [ApiController]
   [Route("api/[controller]")]
   public class UserController : ApiController
   {
      private readonly IIdentityService _identityService;
      public UserController(IIdentityService identityService)
      {
         _identityService = identityService;
      }

      [HttpGet("get-all")]
      [Authorize(Roles = "Admin")]
      public async Task<IActionResult> GetAll()
      {
         var users = await _identityService.GetAllUsersAsync();
         return Ok(users);
      }


      [HttpGet("get-by-id/{id}")]
      [Authorize(Roles = "Admin")]
      public async Task<IActionResult> GetById(int id)
      {
         var user = await _identityService.GetUserById(id);
         return Ok(user);
      }

      [HttpPost("create")]
      [Authorize(Roles = "Admin")]
      public async Task<IActionResult> Create(CreateUserRequest request)
      {
         var userDto = await _identityService.CreateUserAsync(request);
         return CreatedAtAction(nameof(GetById), new { id = userDto.Id }, userDto);
      }

      [HttpPut("update/{id}")]
      [Authorize(Roles = "Admin")]
      public async Task<IActionResult> Update(int id, UpdateUserRequest request)
      {
         var updatedUser = await _identityService.UpdateUserAsync(id, request);
         return Ok(updatedUser);
      }

      [HttpDelete("delete/{id}")]
      [Authorize(Roles = "Admin")]
      public async Task<IActionResult> Delete(int id)
      {
         await _identityService.DeleteUserAsync(id);
         return Ok(new { message = "Xóa thành công" });
      }

   }
}