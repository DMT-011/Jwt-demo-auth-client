
using JwtDemo.Entities;
using System.Threading.Tasks;

namespace JwtDemo.Repositories.Interfaces
{
    public interface IUserRepository
    {
        Task<User?> GetByIdAsync(int id);
        Task<User?> GetByUsernameAsync(string username);
        Task<bool> ExistsByEmailAsync(string email);
        Task<bool> ExistsByUsernameAsync(string username);
        Task AddAsync(User user);
        void Update(User user);
        Task<int> SaveChangesAsync();
        Task<IEnumerable<User>> GetAllAsync();
        void Delete(User user);
        Task<Role?> GetRoleByNameAsync(string roleName);
       
    }
}
