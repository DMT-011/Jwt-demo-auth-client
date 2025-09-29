

using JwtDemo.DTOs.Requests;
using JwtDemo.DTOs.Requests.User;
using JwtDemo.DTOs.Response;
using JwtDemo.Entities;

namespace JwtDemo.Services.Interfaces;

public interface IIdentityService
{
   Task<AuthenticationResponse> LoginAsync(LoginRequest model, string ipAddress);

   Task RegisterAsync(RegisterRequest model);
   Task<UserDto> GetUserById(int id);
   Task<IEnumerable<UserDto>> GetAllUsersAsync();
   Task<UserDto> CreateUserAsync(CreateUserRequest request);
   Task<UserDto> UpdateUserAsync(int id, UpdateUserRequest request);
   Task DeleteUserAsync(int id);

}