namespace image_indexator_backend.Models.Image
{
	public class ImageWebResponse
	{
		public int Id { get; set; }
		public string Metadata { get; set; } = null!;
		public string Url { get; set; } = null!;
	}
}
