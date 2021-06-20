using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace Entities.Models
{
    public class User
    {
        public Guid Id { get; set; }

        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Username { get; set; }

        [JsonIgnore]
        public string Password { get; set; }

        public IEnumerable<string> Roles { get; set; }
        
        [JsonIgnore]
        public ISet<RefreshToken> RefreshTokens { get; set; }
    }
}
