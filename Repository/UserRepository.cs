#nullable enable
using System;
using System.Linq;
using Contracts;
using Entities;
using Entities.Models;

namespace Repository
{
    public class UserRepository : RepositoryBase<User>, IUserRepository
    {

        public UserRepository(RepositoryContext repositoryContext) : base(repositoryContext)
        {
        }

        public User? FindByUsername(string username, bool trackChanges = false)
        {
            return FindByCondition(u => u.Username == username, trackChanges).FirstOrDefault();
        }
        public User? FindByUserId(Guid id, bool trackChanges = false)
        {
            return FindByCondition(u => u.Id == id, trackChanges).FirstOrDefault();
        }
    }
}
