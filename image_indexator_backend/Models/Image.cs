using NpgsqlTypes;

namespace image_indexator_backend.Models
{
	public class Image
	{
		public int Id { get; set; }
		public string OwnerUserId { get; set; } = null!;
		public string Metadata { get; set; } = null!;
		public NpgsqlTsVector MetadataVector { get; set; } = null!;
	}
}
