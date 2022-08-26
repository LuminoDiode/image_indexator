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

		protected override void OnModelCreating(ModelBuilder builder)
		{
			base.OnModelCreating(builder);

			// https://www.npgsql.org/efcore/api/Microsoft.EntityFrameworkCore.NpgsqlEntityTypeBuilderExtensions.html#Microsoft_EntityFrameworkCore_NpgsqlEntityTypeBuilderExtensions_HasGeneratedTsVectorColumn__1_EntityTypeBuilder___0__Expression_Func___0_NpgsqlTsVector___System_String_Expression_Func___0_System_Object___
			// https://www.postgresql.org/docs/current/textsearch-controls.html
			// https://postgrespro.ru/docs/postgresql/9.6/functions-textsearch
			// wtf should I use if this is an interlanguage app???
			// regconfig possible values (psql \dF) 
			//   Schema   |    Name    |              Description
			//------------+------------+---------------------------------------
			// pg_catalog | arabic     | configuration for arabic language
			// pg_catalog | armenian   | configuration for armenian language
			// pg_catalog | basque     | configuration for basque language
			// pg_catalog | catalan    | configuration for catalan language
			// pg_catalog | danish     | configuration for danish language
			// pg_catalog | dutch      | configuration for dutch language
			// pg_catalog | english    | configuration for english language
			// pg_catalog | finnish    | configuration for finnish language
			// pg_catalog | french     | configuration for french language
			// pg_catalog | german     | configuration for german language
			// pg_catalog | greek      | configuration for greek language
			// pg_catalog | hindi      | configuration for hindi language
			// pg_catalog | hungarian  | configuration for hungarian language
			// pg_catalog | indonesian | configuration for indonesian language
			// pg_catalog | irish      | configuration for irish language
			// pg_catalog | italian    | configuration for italian language
			// pg_catalog | lithuanian | configuration for lithuanian language
			// pg_catalog | nepali     | configuration for nepali language
			// pg_catalog | norwegian  | configuration for norwegian language
			// pg_catalog | portuguese | configuration for portuguese language
			// pg_catalog | romanian   | configuration for romanian language
			// pg_catalog | russian    | configuration for russian language
			// pg_catalog | serbian    | configuration for serbian language
			// pg_catalog | simple     | simple configuration
			// pg_catalog | spanish    | configuration for spanish language
			// pg_catalog | swedish    | configuration for swedish language
			// pg_catalog | tamil      | configuration for tamil language
			// pg_catalog | turkish    | configuration for turkish language
			// pg_catalog | yiddish    | configuration for yiddish language
			builder.Entity<Image>()
				.HasGeneratedTsVectorColumn(expr => expr.MetadataVector, "simple", img => img.Metadata)
				.HasIndex(imgEntity => imgEntity.MetadataVector)
				.HasMethod("GIN");
		}


		public DbSet<Image> Images { get; set; } = null!;
	}
}
