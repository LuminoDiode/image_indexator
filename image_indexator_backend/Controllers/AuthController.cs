//using image_indexator_backend.Services;
using image_indexator_backend.Helpers;
using image_indexator_backend.Models.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;
using static Utf8Json.JsonSerializer;

namespace image_indexator_backend.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	[AllowAnonymous]
	[Consumes("application/json")]
	[Produces("application/json")]
	public sealed class AuthController : ControllerBase
	{
		private readonly UserManager<IdentityUser> _userManager;
		private readonly IConfiguration _configuration;
		private readonly ILogger _logger;

		public AuthController(UserManager<IdentityUser> userMgr, IConfiguration config, ILogger<AuthController> logger)
		{
			_userManager = userMgr;
			_configuration = config;
			_logger = logger;
		}

		[HttpPost]
		public async Task<IActionResult> Login([FromBody][Required] AuthenticateRequest request)
		{
			IdentityUser? usr = await _userManager.FindByEmailAsync(request.Email);

			if (usr is not null)
			{
				bool passwordIsCorrect = await _userManager.CheckPasswordAsync(usr, request.Password);
				if (passwordIsCorrect)
				{
					var response = new AuthenticateResponse { Id = usr.Id, Email = usr.Email, Token = JwtHelper.GenerateJwtToken(_configuration, usr) };
					_logger.LogDebug($"Created JWT token \'{response.Token}\' for user {ToJsonString(usr)} and sended to \'{base.HttpContext.Connection.RemoteIpAddress}\'.");
					return Ok(response);
				}
				else { ModelState.TryAddModelError("WrongPassword", "Wrong password."); }
			}
			else
			{
				if (ModelState.IsValid)
				{
					IdentityResult registerResult = await _userManager.CreateAsync(new IdentityUser(Base64UrlEncoder.Encode(SHA1.HashData(Encoding.UTF8.GetBytes("User")))) { Email = request.Email }, request.Password);
					if (registerResult.Succeeded)
					{
						_logger.LogDebug($"Created new user in database with email \'{request.Email}\' by request from \'{base.HttpContext.Connection.RemoteIpAddress}\'.");
						return await Login(request);
					}
					else { registerResult.Errors.ToList().ForEach(e => ModelState.AddModelError(e.Code, e.Description)); }
				}
			}

			_logger.LogDebug($"Refused to create JWT token for request from \'{base.HttpContext.Connection.RemoteIpAddress}\' with credentials {ToJsonString(request)} cause of {ToJsonString(ModelState.Values.Select(v => v.Errors.Select(e => e.ErrorMessage)))}");
			return BadRequest(ModelState);
		}
	}
}
