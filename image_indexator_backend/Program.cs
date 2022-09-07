using image_indexator_backend.Repository;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using System.Text;

namespace image_indexator_backend
{
	class Program
	{
		public static void Main(string[] args)
		{
			WebApplicationBuilder builder = WebApplication.CreateBuilder(args);
			builder.Configuration.AddJsonFile("/run/secrets/backendsecrets.json", false).Build();

			builder.Host.ConfigureLogging(opts =>
			{
				opts.AddConsole();
			});

			builder.Services.AddDbContext<IndexatorDbContext>(opts =>
			{
				opts.UseNpgsql(builder.Configuration["ConnectionStrings:DefaultConnection"]);
			});

			builder.Services.AddAuthentication(opts =>
			{
				opts.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
			}).AddJwtBearer(opts =>
			   {
				   if (builder.Environment.IsDevelopment()) opts.RequireHttpsMetadata = false;
				   else opts.RequireHttpsMetadata = true;
		
				   opts.SaveToken = false;
				   opts.TokenValidationParameters = new TokenValidationParameters
				   {
					   ValidateIssuerSigningKey = true,
					   IssuerSigningKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(builder.Configuration["Jwt:Key"])),
					   ValidateAudience = false,
					   ValidateIssuer = false,
					   //NameClaimType = System.Security.Claims.ClaimTypes.NameIdentifier
				   };
			   }
			).AddIdentityServerJwt();

			builder.Services.AddIdentityCore<IdentityUser>(opts =>
			{
				opts.Password.RequireLowercase = true;
				opts.Password.RequireUppercase = true;
				opts.Password.RequireDigit = true;
				opts.Password.RequireNonAlphanumeric = false;
				opts.User.RequireUniqueEmail = true;
			})
				.AddEntityFrameworkStores<IndexatorDbContext>()
				.AddDefaultTokenProviders();


			builder.Services.AddControllers();

			builder.Services.AddEndpointsApiExplorer();
			builder.Services.AddSwaggerGen(opts =>
			{
				opts.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
				{
					In = ParameterLocation.Header,
					Description = "Please insert JWT with Bearer into field",
					Name = "Authorization",
					Type = SecuritySchemeType.Http,
					Scheme = "Bearer",
					BearerFormat = "JWT"
				});
				opts.AddSecurityRequirement(new OpenApiSecurityRequirement {
				{
					new OpenApiSecurityScheme
					{
						Reference = new OpenApiReference
						{
							Type = ReferenceType.SecurityScheme,
							Id = "Bearer"
						}
					},
					new string[] { }
				}});
			});

			builder.Services.AddDirectoryBrowser();

			WebApplication app = builder.Build();

			if (app.Environment.IsDevelopment())
			{
				app.UseSwagger();
				app.UseSwaggerUI();
			}

			app.UseCors(opts =>
			{
				opts.AllowAnyOrigin();
				opts.AllowAnyMethod();
				opts.AllowAnyHeader();
			});

			//app.UseHttpsRedirection();
			app.Use(async (context, next) => { await next.Invoke(); });
			app.UseStaticFiles("/staticfiles");
			app.UseDirectoryBrowser("/staticfiles");
			app.Use(async (context, next) => { await next.Invoke(); });
			app.UseAuthentication();
			app.Use(async (context, next) => { await next.Invoke(); });
			app.UseRouting();
			app.Use(async (context, next) => { await next.Invoke(); });
			app.UseAuthorization();
			app.Use(async (context, next) => { await next.Invoke(); });

			app.MapControllers();

			app.Services.CreateScope().ServiceProvider.GetRequiredService<IndexatorDbContext>().Database.EnsureCreated();

			app.Run();
		}
	}
}