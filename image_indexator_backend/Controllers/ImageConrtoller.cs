using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;
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
using image_indexator_backend.Services;
using System.Diagnostics.Metrics;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using System.IO;

namespace image_indexator_backend.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public sealed class ImageController : ControllerBase
	{
		internal const string uploadsPath = @"/images";
		internal const string downloadsPath = @"/staticfiles/images";
		internal const int maxImageSizeBytes = 500 * 1024;

		//private readonly UserManager<IdentityUser> _userManager;
		private readonly IConfiguration _configuration;
		private readonly ILogger _logger;
		private readonly IndexatorDbContext _dbContext;
		private readonly IWebHostEnvironment _environment;
		private readonly FileUrnService _urnService;
		private readonly RecentImagesService _recentImagesService;

		public ImageController(
			IConfiguration config,
			ILogger<AuthController> logger,
			IndexatorDbContext dbContext,
			IWebHostEnvironment environment,
			FileUrnService urnService,
			RecentImagesService recentImagesService)
		{
			_configuration = config;
			_logger = logger;
			_dbContext = dbContext;
			_environment = environment;
			_urnService = urnService;
			_recentImagesService = recentImagesService;
		}


		[NonAction]
		private ImageWebResponse ImageToResponse(Image image) => new ImageWebResponse { Id = image.Id, Metadata = image.Metadata, Url = _urnService.UrnToGetImage(image) };


		[HttpGet]
		[AllowAnonymous]
		[Route("{id:int}")]
		public async Task<IActionResult> GetImageByRoute([FromRoute][Required] int Id) => await GetImage(Id);

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

			return Ok(ImageToResponse(image));
		}


		[HttpPost]
		[AllowAnonymous]
		public async Task<IActionResult> SearchImages([FromBody][Required] ImageQueryRequest request)
		{
			if (string.IsNullOrEmpty(request.Query))
				return Ok(_recentImagesService.Images.Take(request.maxCount ?? 12));
			else
				return Ok((await _dbContext.Images.OrderByDescending(img => img.MetadataVector.Rank(EF.Functions.WebSearchToTsQuery(request.Query))).Take(request.maxCount ?? 12)
					.ToListAsync()).Select(x=> ImageToResponse(x)));

			// ! do not consolidate the Takes. The first works with IEnumerable, the second with IQueryable.
		}


		const string AllowedFormat = @"image/jpeg";
		[HttpPut]
		[Authorize]
		[Consumes(@"multipart/form-data")]
		public async Task<IActionResult> AddImage([FromForm][Required] IFormFile file, [FromForm][Required] string metadata)
		{

			if (file.ContentType != AllowedFormat)
			{
				ModelState.AddModelError("FileExtensionError", "Only jpeg files are allowed for this action.");
				return UnprocessableEntity(ModelState);
			}

			var fileSize = file.Length;
			if (fileSize > maxImageSizeBytes) // size > 300 KB
			{
				ModelState.AddModelError("FileTooBig", $"File received by the server is too big. Max allowed size is {maxImageSizeBytes / 1024} KB.");
				return ValidationProblem(new ValidationProblemDetails(ModelState) { Status = 413 }); // HTTP/413 Request Entity Too Large
			}

			EntityEntry<Image> added = null!;
			try
			{
				added = await _dbContext.Images.AddAsync(new()
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

				var filePath = Path.Join(this._environment.WebRootPath,_urnService.UrnToSetImage(added.Entity));
				var fileDirPath = Path.GetDirectoryName(filePath); Directory.CreateDirectory(fileDirPath!); // ! ArgumentNullException - no special strategy needed

				var myFile = System.IO.File.Create(filePath);
				await file.OpenReadStream().CopyToAsync(myFile);
				await myFile.DisposeAsync();
			}
			catch
			{
				if (added != null)
				{
					_dbContext.Images.Remove(added.Entity); // sets tracking status
					if (System.IO.File.Exists(_urnService.UrnToSetImage(added.Entity)))
					{
						System.IO.File.Delete(_urnService.UrnToSetImage(added.Entity));
					}
				}
				throw;
			}
			return await GetImage(added.Entity.Id);
		}
	}
}