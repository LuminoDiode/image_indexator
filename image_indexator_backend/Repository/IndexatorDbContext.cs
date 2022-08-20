using image_indexator_backend.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace image_indexator_backend.Repository
{
	public class IndexatorDbContext : IdentityDbContext
	{
		public IndexatorDbContext(DbContextOptions options) : base(options)
		{
			Database.EnsureCreated();
		}

		public DbSet<Image> Images { get; set; } = null!;
	}
}
