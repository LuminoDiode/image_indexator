using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.ComponentModel.DataAnnotations;

namespace image_indexator_backend.Controllers
{
	[ApiController]
	[Route("api/[controller]")]
	public class ImageController : ControllerBase
	{
		[HttpGet]
		[AllowAnonymous]
		public async Task<IActionResult> GetImage([FromBody][Required] int Id)
		{
			await Task.Delay(1000);
			throw new NotImplementedException();
		}

		[HttpPut]
		[Authorize]
		[Consumes(@"multipart/form-data")]
		public async Task<IActionResult> AddImage([FromForm][Required] IFormFile file)
		{
			var gotFileStream = file.OpenReadStream();
			var myFile = System.IO.File.Create(Environment.GetFolderPath(Environment.SpecialFolder.Desktop) + "\\myfile.jpg");
			await gotFileStream.CopyToAsync(myFile);
			myFile.Close();
			return Ok();
		}
	}
}
