namespace image_indexator_backend.Models.Auth
{
	public class AuthenticateResponse
	{
		public string Id { get; set; } = null!;
		public string Email { get; set; } = null!;
		public string Token { get; set; } = null!;
	}
}
