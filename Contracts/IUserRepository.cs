using System;
using Entities.Models;

namespace Contracts
{
    public interface IUserRepository : IRepositoryBase<User>
    {
        User FindByUsername(string username, bool trackChanges = false);
        User FindByUserId(Guid id, bool trackChanges = false);
    }
}
