using JwtDemo.Data;
using JwtDemo.DTOs.Requests;
using JwtDemo.DTOs.Requests.User;
using JwtDemo.DTOs.Response;
using JwtDemo.Entities;
using JwtDemo.Helpers;
using JwtDemo.Repositories.Interfaces;
using JwtDemo.Services.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace JwtDemo.Services;

public class IdentityService : IIdentityService
{
    private readonly IUserRepository _userRepository;
    private readonly IJwtUtils _jwtUtils;

    public IdentityService(IUserRepository userRepository, IJwtUtils jwtUtils)
    {
        _userRepository = userRepository;
        _jwtUtils = jwtUtils;
    }

    public async Task<AuthenticationResponse> LoginAsync(LoginRequest model, string ipAddress)
    {
        var user = await _userRepository.GetByUsernameAsync(model.UserName);

        if (user == null || !PasswordHelper.VerifyPasswordHash(model.Password, user.PasswordHash, user.PasswordSalt))
            throw new Exception("Tài khoản hoặc mật khẩu không đúng");

        var roles = user.UserRoles.Select(ur => ur.Role.Name).ToList();
        var jwtToken = _jwtUtils.GenerateJwtToken(user, roles);
        var refreshToken = _jwtUtils.GenerateRefreshToken(ipAddress);
        user.RefreshTokens.Add(refreshToken);

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();

        return new AuthenticationResponse(user, jwtToken, refreshToken.Token);
    }

    public async Task RegisterAsync(RegisterRequest model)
    {
        if (await _userRepository.ExistsByEmailAsync(model.Email))
            throw new Exception($"Email \"{model.Email}\" đã tồn tại");
        if (await _userRepository.ExistsByUsernameAsync(model.UserName))
            throw new Exception($"Username \"{model.UserName}\" đã tồn tại");

        var user = new User
        {
            FirstName = model.FirstName,
            LastName = model.LastName,
            Email = model.Email,
            UserName = model.UserName
        };

        PasswordHelper.CreatePasswordHash(model.Password, out byte[] passwordHash, out byte[] passwordSalt);

        user.PasswordHash = passwordHash;
        user.PasswordSalt = passwordSalt;

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();
    }

    public async Task<UserDto> GetUserById(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null) throw new KeyNotFoundException("User not found");

        return new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
            Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList()
        };
    }

    public async Task<IEnumerable<UserDto>> GetAllUsersAsync()
    {
        var users = await _userRepository.GetAllAsync();
        return users.Select(u => new UserDto
        {
            Id = u.Id,
            FirstName = u.FirstName,
            LastName = u.LastName,
            UserName = u.UserName,
            Email = u.Email,
            Roles = u.UserRoles?.Select(ur => ur.Role.Name).ToList() ?? new List<string>()
        });
    }

    // ...existing code...
    public async Task<UserDto> CreateUserAsync(CreateUserRequest request)
    {
        if (await _userRepository.ExistsByUsernameAsync(request.UserName))
            throw new Exception($"Username '{request.UserName}' đã tồn tại.");
        if (await _userRepository.ExistsByEmailAsync(request.Email))
            throw new Exception($"Email '{request.Email}' đã tồn tại.");

        var user = new User
        {
            FirstName = request.FirstName,
            LastName = request.LastName,
            Email = request.Email,
            UserName = request.UserName,
            Type = (EUserType) request.Type,
        };
        
        PasswordHelper.CreatePasswordHash(request.Password, out byte[] passwordHash, out byte[] passwordSalt);
        user.PasswordHash = passwordHash;
        user.PasswordSalt = passwordSalt;

        await _userRepository.AddAsync(user);
        await _userRepository.SaveChangesAsync();
        
        user.UserRoles.Add(new UserRole
        {
            RoleId = (int) user.Type
        });
        await _userRepository.SaveChangesAsync();
            
        return new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
            Roles = user.UserRoles?.Select(ur => ur.Role.Name).ToList() ?? new List<string>()
        };
    }

    // ...existing code...
    public async Task<UserDto> UpdateUserAsync(int id, UpdateUserRequest request)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            throw new KeyNotFoundException("Không tìm thấy người dùng.");


        user.FirstName = request.FirstName ?? user.FirstName;
        user.LastName = request.LastName ?? user.LastName;


        if (!string.IsNullOrEmpty(request.Email) && user.Email != request.Email)
        {
            if (await _userRepository.ExistsByEmailAsync(request.Email))
                throw new Exception($"Email '{request.Email}' đã được sử dụng.");
            user.Email = request.Email;
        }


        if (!string.IsNullOrEmpty(request.Password))
        {
            PasswordHelper.CreatePasswordHash(request.Password, out byte[]
                passwordHash, out byte[] passwordSalt);
            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;
        }

        // Cập nhật Roles (nếu có)
        if (request.Roles != null)
        {
            user.UserRoles.Clear(); // Xóa roles cũ trực tiếp trên collection gốc
            foreach (var roleName in request.Roles.Distinct()) // Chỉ xử lý các role không trùng lặp
            {
                var role = await _userRepository.GetRoleByNameAsync(roleName);
                if (role != null)
                {
                    user.UserRoles.Add(new UserRole { Role = role });
                }
            }
        }

        _userRepository.Update(user);
        await _userRepository.SaveChangesAsync();

        return new UserDto
        {
            Id = user.Id,
            FirstName = user.FirstName,
            LastName = user.LastName,
            UserName = user.UserName,
            Email = user.Email,
            Roles = user.UserRoles.Select(ur => ur.Role.Name).ToList()
        };
    }

    public async Task DeleteUserAsync(int id)
    {
        var user = await _userRepository.GetByIdAsync(id);
        if (user == null)
            throw new KeyNotFoundException("Không tìm thấy người dùng.");

        _userRepository.Delete(user);
        await _userRepository.SaveChangesAsync();
    }
}