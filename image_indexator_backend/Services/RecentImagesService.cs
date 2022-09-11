using image_indexator_backend.Models.Image;
using image_indexator_backend.Models.Runtime;
using image_indexator_backend.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System.Collections.ObjectModel;

namespace image_indexator_backend.Services
{
	public sealed class RecentImagesService:BackgroundService
	{
		private IndexatorDbContext _dbContext;
		private IConfiguration _configuration;
		private FileUrnService _urnService;
		private ILogger _logger;

		private RecentImagesServiceSettings? _settings => _configuration
			.GetSection(nameof(RecentImagesServiceSettings))?
			.Get<RecentImagesServiceSettings?>();
		private int _numOfImagesStored => _settings?.numberOfImagesStored ?? 12;
		private int _renewIntervalSeconds => _settings?.renewIntervalSeconds ?? 60;

		private List<ImageWebResponse> _images;
		public ReadOnlyCollection<ImageWebResponse> Images => _images.AsReadOnly();
		
		public RecentImagesService(IndexatorDbContext dbContext, IConfiguration configuration, FileUrnService urnService, ILogger<RecentImagesService>logger)
		{
			_dbContext = dbContext;
			_configuration = configuration;
			_urnService = urnService;
			_images = new List<ImageWebResponse>(_numOfImagesStored);
			_logger = logger;
		}
		private async Task updateFromDb()
		{
			_images = (await _dbContext.Images.OrderByDescending(x=> x.Id).Take(_numOfImagesStored).ToListAsync()).Select(i=> new ImageWebResponse { Id = i.Id, Metadata = i.Metadata, Url = _urnService.UrnToGetImage(i) }).ToList();
			_logger.LogInformation($"Updated from db. Current stored id's: {string.Join(' ', _images.Select(x => x.Id))}");
		}
		protected override async Task ExecuteAsync(CancellationToken stoppingToken)
		{
			_logger.LogInformation($"Background execution began. Renew interval is {_renewIntervalSeconds} seconds");
			await updateFromDb();

			while (!stoppingToken.IsCancellationRequested)
			{
				await Task.Delay(1000 * this._renewIntervalSeconds);
				await updateFromDb();
			}
		}
	}
}
