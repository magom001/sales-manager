using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using Contracts;
using Entities.DataTransferObjects;
using Entities.Models;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace SalesManagerAPI.Auth
{
    public class AuthenticationManager : IAuthenticationManager
    {
        private readonly IRepositoryManager _repository;
        private readonly IConfiguration _configuration;

        public AuthenticationManager(IRepositoryManager repository, IConfiguration configuration)
        {
            _repository = repository;
            _configuration = configuration;
        }

        public async Task<AuthResponseDto> Authenticate(LoginDto loginDto)
        {
            if (loginDto == null){
                return null;
            }

            var user = _repository.User.FindByUsername(loginDto.Username, true);

            if (user == null){
                return null;
            }

            if (!BCrypt.Net.BCrypt.Verify(loginDto.Password, user.Password)) return null;

            var tokens = await CreateTokens(user);

            return new AuthResponseDto()
            {
                AuthTokensDto = tokens,
                User = user
            };
        }


        public async Task<AuthTokensDto> CreateTokens(User user)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.Name, user.Username)
            };
            claims.AddRange(user.Roles.Select(role => new Claim(ClaimTypes.Role, role)));

            var tokenOptions = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.Now.AddMinutes(30),
            signingCredentials: GetSigningCredentials()
            );

            var accessTokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);
            var refreshToken = GenerateRefreshJwtToken(user);

            foreach (var t in user.RefreshTokens ?? new HashSet<RefreshToken>()){
                var token = new JwtSecurityTokenHandler().ReadToken(t.Token);

                if (token.ValidTo < DateTime.UtcNow){
                    user.RefreshTokens?.Remove(t);
                }
            }

            if (user.RefreshTokens != null){
                user.RefreshTokens.Add(refreshToken);
            }
            else{
                user.RefreshTokens = new HashSet<RefreshToken>()
                {
                    refreshToken
                };
            }

            await _repository.SaveAsync();

            return new AuthTokensDto()
            {
                AccessToken = accessTokenString,
                RefreshToken = refreshToken.Token,
            };
        }

        public async Task<AuthTokensDto> RefreshTokens(string refreshToken)
        {
            try{
                var tokenHandler = new JwtSecurityTokenHandler();
                var token = tokenHandler.ReadJwtToken(refreshToken);

                if (token.ValidTo < DateTime.UtcNow){
                    return null;
                }

                var userId = token.Claims.SingleOrDefault(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

                if (string.IsNullOrEmpty(userId)){
                    return null;
                }

                var user = _repository.User.FindByUserId(new Guid(userId), true);

                var savedToken = user?.RefreshTokens.FirstOrDefault(t => t.Token == refreshToken);

                if (savedToken == null){
                    return null;
                }

                user.RefreshTokens.Remove(savedToken);

                return await CreateTokens(user);
            }
            catch{
                return null;
            }
        }

        private RefreshToken GenerateRefreshJwtToken(User user)
        {
            var claims = new List<Claim>
            {
                new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            };

            var jwtToken = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: GetSigningCredentials()
            );

            return new RefreshToken()
            {
                UserId = user.Id,
                Token = new JwtSecurityTokenHandler().WriteToken(jwtToken)
            };
        }

        private SigningCredentials GetSigningCredentials()
        {
            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Auth:Secret"]));
            return new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);
        }
    }
}
