using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Net.Http.Headers;
using System.Security.Claims;
using System.Threading.Tasks;
using AutoMapper;
using Contracts;
using Entities.DataTransferObjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace SalesManagerAPI.Controllers
{
    [Authorize]
    [ApiController]
    [Route("api/v{version:ApiVersion}/auth")]
    [ApiVersion("1.0")]
    public class AuthController : ControllerBase
    {
        private readonly IRepositoryManager _repository;
        private readonly IConfiguration _configuration;
        private readonly IAuthenticationManager _authManager;
        private readonly IMapper _mapper;

        public AuthController(IConfiguration configuration, IRepositoryManager repository, IAuthenticationManager authManager, IMapper mapper)
        {
            _configuration = configuration;
            _repository = repository;
            _authManager = authManager;
            _mapper = mapper;
        }

        [HttpGet, Route("whoami")]
        public IActionResult WhoAmI([FromHeader] string authorization)
        {
            if (AuthenticationHeaderValue.TryParse(authorization, out var headerValue)){
                var tokenString = headerValue.Parameter;

                var token = new JwtSecurityTokenHandler().ReadJwtToken(tokenString);

                var nameClaim = token.Claims.FirstOrDefault(c => c.Type == ClaimTypes.Name);

                if (nameClaim == null){
                    return StatusCode(500);
                }

                var user = _repository.User.FindByUsername(nameClaim.Value);

                if (user == null){
                    return StatusCode(500);
                }

                var userDto = _mapper.Map<UserDto>(user);

                return Ok(userDto);
            }

            return StatusCode(500);
        }

        [AllowAnonymous]
        [HttpPost, Route("login")]
        public async Task<IActionResult> Login([FromBody] LoginDto loginData)
        {
            var authResponseDto = await _authManager.Authenticate(loginData);

            if (authResponseDto == null){
                return Unauthorized();
            }

            return Ok(authResponseDto.AuthTokensDto);
        }

        [AllowAnonymous]
        [HttpPost, Route("refresh")]
        public async Task<IActionResult> Refresh([FromBody] RefreshTokenDto refreshTokenDto)
        {
            var tokens = await _authManager.RefreshTokens(refreshTokenDto.RefreshToken);

            if (tokens == null){
                return Unauthorized();
            }

            return Ok(tokens);
        }
    }
}
