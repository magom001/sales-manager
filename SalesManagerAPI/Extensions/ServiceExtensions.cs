using Contracts;
using Entities;
using LoggerService;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Repository;

namespace SalesManagerAPI.Extensions
{
    public static class ServiceExtensions
    {
        public static void ConfigureLoggerService(this IServiceCollection services) =>
            services.AddScoped<ILoggerManager, LoggerManager>();

        public static void ConfigureDbContext(
            this IServiceCollection services,
            IConfiguration configuration) =>
            services.AddDbContext<RepositoryContext>(options =>
                options.UseCosmos(
                connectionString: configuration.GetConnectionString("DefaultConnection"),
                databaseName: "Main"
                )
            );
        
        public static void ConfigureRepositoryManager(this IServiceCollection services) =>
            services.AddScoped<IRepositoryManager, RepositoryManager>();
    }
}
