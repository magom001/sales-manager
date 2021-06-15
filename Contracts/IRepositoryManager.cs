using System.Threading.Tasks;

namespace Contracts
{
    public interface IRepositoryManager
    {
        IProductRepository Product { get; }

        Task SaveAsync();
        void Save();
    }
}
