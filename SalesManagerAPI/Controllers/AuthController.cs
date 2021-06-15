using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;

namespace invoicelog.Controllers
{
    public class LoginModel
    {
        public string UserName { get; set; }

        public string Password { get; set; }
    }

    [ApiController]
    [Route("api/v{version:ApiVersion}/auth")]
    [ApiVersion("1.0")]
    public class AuthController : ControllerBase
    {
        public AuthController(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        private IConfiguration Configuration { get; }

        private readonly string _hashedPassword = BCrypt.Net.BCrypt.HashPassword("test");

        [HttpPost, Route("login")]
        public IActionResult Login([FromBody] LoginModel user)
        {
            if (user == null)
            {
                return BadRequest("Invalid credentials");
            }

            if (user.UserName != "test" || !BCrypt.Net.BCrypt.Verify(user.Password, _hashedPassword)) return Unauthorized();

            var secretKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Configuration["Auth:Secret"]));
            var signingCredentials = new SigningCredentials(secretKey, SecurityAlgorithms.HmacSha256);

            var tokenOptions = new JwtSecurityToken(
            claims: new List<Claim>(),
            expires: DateTime.Now.AddMinutes(5),
            signingCredentials: signingCredentials
            );

            var tokenString = new JwtSecurityTokenHandler().WriteToken(tokenOptions);

            return Ok(new { Token = tokenString });

        }
    }
}
