using System;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration
{
    public class ProductConfiguration : IEntityTypeConfiguration<Product>
    {

        public void Configure(EntityTypeBuilder<Product> builder)
        {
            builder.ToContainer("Products");
            builder.HasData(
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Spruce GOST 26002-83 1-4 22x150x4000"
            },
            new Product
            {
                Id = Guid.NewGuid(),
                Name = "Spruce GUST 26002-83 5 22x150x4000"
            }
            );
        }
    }
}
