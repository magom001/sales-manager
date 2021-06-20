using System.Threading.Tasks;
using Contracts;
using Entities;

namespace Repository
{
    public class RepositoryManager : IRepositoryManager
    {
        private RepositoryContext _repositoryContext;

        private IProductRepository _productRepository;
        private IUserRepository _userRepository;

        public RepositoryManager(RepositoryContext repositoryContext)
        {
            _repositoryContext = repositoryContext;
        }

        public IProductRepository Product => _productRepository ??= new ProductRepository(_repositoryContext);

        public IUserRepository User => _userRepository ??= new UserRepository(_repositoryContext);

        public Task SaveAsync() => _repositoryContext.SaveChangesAsync();

        public void Save()
        {
            _repositoryContext.SaveChanges();
        }
    }
}
