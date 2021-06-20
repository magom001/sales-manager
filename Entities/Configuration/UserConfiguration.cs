using System;
using Entities.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace Entities.Configuration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>

    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder.ToContainer("Users");
            builder.Property(u => u.Roles).HasConversion(
            v => string.Join(',', v),
            v => v.Split(',', StringSplitOptions.RemoveEmptyEntries)
            );

            builder.HasIndex(u => u.Username).IsUnique();

            builder.OwnsMany(
            u => u.RefreshTokens,
            rt => {
                rt.ToJsonProperty("RefreshTokens");
            }
            );
        }
    }
}
