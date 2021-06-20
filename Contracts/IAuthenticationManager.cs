using System.Threading.Tasks;
using Entities.DataTransferObjects;
using Entities.Models;

namespace Contracts
{
    
    public interface IAuthenticationManager
    {
        Task<AuthResponseDto> Authenticate(LoginDto loginDto);
        Task<AuthTokensDto> CreateTokens(User user);
        Task<AuthTokensDto> RefreshTokens(string refreshToken);
    }
}
