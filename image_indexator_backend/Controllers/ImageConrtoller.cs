using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
using image_indexator_backend.Helpers;
using image_indexator_backend.Models.Auth;
using image_indexator_backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;
using System.ComponentModel.DataAnnotations;
using System.Security.Cryptography;
using System.Text;
using static Utf8Json.JsonSerializer;
using image_indexator_backend.Repository;
using Microsoft.EntityFrameworkCore;
using Duende.IdentityServer.Extensions;
using System.Web;
using Microsoft.AspNetCore.Hosting.Server.Features;
using System.IO;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using image_indexator_backend.Models.Image;

namespace image_indexator_backend.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public sealed class ImageController : ControllerBase
	{
		const string uploadsPath = @"\staticfiles\images";
		const int maxImageSizeBytes = 500 * 1024;

		//private readonly UserManager<IdentityUser> _userManager;
		private readonly IConfiguration _configuration;
		private readonly ILogger _logger;
		private readonly IndexatorDbContext _dbContext;
		private readonly IWebHostEnvironment _environment;

		public ImageController(IConfiguration config, ILogger<AuthController> logger, IndexatorDbContext dbContext, IWebHostEnvironment environment)
		{
			_configuration = config;
			_logger = logger;
			_dbContext = dbContext;
			this._environment = environment;
		}

		[HttpGet]
		[AllowAnonymous]
		public async Task<IActionResult> GetImage([FromBody][Required] int Id)
		{
			var image = await this._dbContext.Images.FindAsync(Id);
			if (image is null)
			{
				ModelState.AddModelError("ImageNotFound", $"Image with ID {Id} not found on server.");
				return BadRequest(ModelState);
			}

			return Ok(new ImageWebResponse { Id = image.Id, Metadata = image.Metadata, Url = Path.Join(uploadsPath, Id.ToString() + ".jpeg").Replace('\\','/') });
		}

		[HttpGet]
		[AllowAnonymous]
		[Route("{id:int}")]
		public async Task<IActionResult> GetImageQuery([FromRoute][Required] int Id) => await GetImage(Id);


		const string AllowedFormat = @"image/jpeg";
		[HttpPut]
		[Authorize]
		[Consumes(@"multipart/form-data")]
		public async Task<IActionResult> AddImage([FromForm][Required] IFormFile file, [FromForm][Required] string metadata)
		{
			if (file.ContentType!= AllowedFormat)
			{
				ModelState.AddModelError("FileExtensionError", "Only jpeg files are allowed for this action.");
				return BadRequest(ModelState);
			}

			var fileSize = file.Length;
			if (fileSize > maxImageSizeBytes) // size > 300 KB
			{
				ModelState.AddModelError("FileTooBig", $"File received by the server is too big. Max allowed size is {maxImageSizeBytes / 1024} KB.");
				return BadRequest(ModelState);
			}

			var added = await _dbContext.Images.AddAsync(new()
			{
				Metadata = metadata,
				OwnerUserId = this.ControllerContext.HttpContext.User.Identities.FirstOrDefault(cl => cl.FindFirst("Id") != null)?.FindFirst("Id")?.Value ?? null
			});
			if (added is null)
			{
				ModelState.AddModelError("DatabaseError", "There was a error adding file to the database.");
				return this.BadRequest(ModelState);
			}
			await _dbContext.SaveChangesAsync();

			var newFilePath = Path.Join(this._environment.WebRootPath, uploadsPath);
			var newFileName = Path.Join(newFilePath, added.Entity.Id.ToString() + ".jpeg");
			Directory.CreateDirectory(newFilePath);

			var gotFileStream = file.OpenReadStream();
			var myFile = System.IO.File.Create(newFileName);
			await gotFileStream.CopyToAsync(myFile);
			myFile.Close();
			return await GetImage(added.Entity.Id);
		}
	}
}
