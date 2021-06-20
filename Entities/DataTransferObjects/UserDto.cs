using System.Collections.Generic;

namespace Entities.DataTransferObjects
{
    public class UserDto
    {
        public string FirstName { get; set; }

        public string LastName { get; set; }

        public string Username { get; set; }

        public IEnumerable<string> Roles { get; set; }
    }
}
