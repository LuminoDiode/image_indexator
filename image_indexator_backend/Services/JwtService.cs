using image_indexator_backend.Models.Runtime;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace image_indexator_backend.Services
{
	public sealed class JwtService
	{
		private IConfiguration _configuration;
		private JwtSecurityTokenHandler _tokenHandler;
		private JwtServiceSettings? _settings => _configuration
			.GetSection(nameof(JwtServiceSettings))?
			.Get<JwtServiceSettings?>();
		private byte[] _jwtKey => Encoding.ASCII.GetBytes(_settings?.signingKey ?? throw new SecurityTokenSignatureKeyNotFoundException("JWT key is not found by runtime."));
		private int _jwtTokenLifetimeDays => _settings?.tokenLifespanDays ?? 60;

		public JwtService(IConfiguration configuration)
		{
			this._configuration = configuration;
			this._tokenHandler = new JwtSecurityTokenHandler();
		}

		public string GenerateJwtToken(IdentityUser user)
			=> GenerateJwtToken(new Claim[] { new Claim("Id", user.Id.ToString()), new Claim("Email", user.Email) });
		public string GenerateJwtToken(IList<Claim> claims)
		{
			return _tokenHandler.WriteToken(_tokenHandler.CreateToken(new SecurityTokenDescriptor
			{
				Subject = new ClaimsIdentity(claims),
				Expires = DateTime.UtcNow.AddDays(_jwtTokenLifetimeDays),
				SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(_jwtKey), SecurityAlgorithms.HmacSha512Signature)
			}));
		}
	}
}
