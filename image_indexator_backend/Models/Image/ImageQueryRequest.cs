namespace image_indexator_backend.Models.Image
{
	public class ImageQueryRequest
	{
		public string? Query { get; set; }
		public int? maxCount { get; set; }
	}
}
