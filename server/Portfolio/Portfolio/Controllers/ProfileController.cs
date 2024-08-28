using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using Portfolio.Data;
using Portfolio.Dtos;
using Portfolio.Models;
using System;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Security.Claims;
using System.Text;

namespace Portfolio.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProfileController : ControllerBase
    {
        private readonly IConfiguration _configuration;
        private readonly DatabaseContext _context;
        private readonly IPasswordHasher<Profile> _passwordHasher;

        public ProfileController(IConfiguration configuration, DatabaseContext context)
        {
            _configuration = configuration;
            _context = context;
            _passwordHasher = new PasswordHasher<Profile>();
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto registerDto)
        {
            var newUser = new Profile
            {
                Name = registerDto.Name,
                Email = registerDto.Email,
                Password = _passwordHasher.HashPassword(null, registerDto.Password) // Hash the password
            };

            _context.Profiles.Add(newUser);
            _context.SaveChanges();

            return Ok(new { Message = "User registered successfully" });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto loginDto)
        {
            var user = _context.Profiles.SingleOrDefault(u => u.Email == loginDto.Email);
            if (user == null)
            {
                return Unauthorized();
            }

            var verificationResult = _passwordHasher.VerifyHashedPassword(user, user.Password, loginDto.Password);
            if (verificationResult != PasswordVerificationResult.Success)
            {
                return Unauthorized();
            }

            var token = GenerateJwtToken(user);
            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };
            Response.Cookies.Append("jwtToken", token, cookieOptions);

            return Ok(new { Token = token });
        }

        private string GenerateJwtToken(Profile user)
        {
            var claims = new[]
            {
                new Claim(JwtRegisteredClaimNames.Sub, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: _configuration["Jwt:Issuer"],
                audience: _configuration["Jwt:Audience"],
                claims: claims,
                expires: DateTime.Now.AddMinutes(30),
                signingCredentials: creds);

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
