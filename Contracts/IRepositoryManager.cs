using System.Threading.Tasks;

namespace Contracts
{
    public interface IRepositoryManager
    {
        IProductRepository Product { get; }

        IUserRepository User { get; }

        Task SaveAsync();
        void Save();
    }
}
