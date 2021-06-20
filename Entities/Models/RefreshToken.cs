using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Runtime.Serialization.Formatters.Binary;

namespace Entities.Models
{
    public class RefreshToken
    {
        public string Token { get; set; }

        public Guid UserId { get; set; }
    }
}
