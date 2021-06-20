using Entities.Models;

namespace Entities.DataTransferObjects
{
    public class AuthResponseDto
    {
        public User User { get; set; }

        public AuthTokensDto AuthTokensDto { get; set; }
    }
}
