using System.Threading.Tasks;
using Contracts;
using Entities;

namespace Repository
{
    public class RepositoryManager : IRepositoryManager
    {
        private RepositoryContext _repositoryContext;

        private IProductRepository _productRepository;

        public RepositoryManager(RepositoryContext repositoryContext)
        {
            _repositoryContext = repositoryContext;
        }

        public IProductRepository Product
        {
            get
            {
                if (_productRepository == null){
                    _productRepository = new ProductRepository(_repositoryContext);
                }

                return _productRepository;
            }
        }

        public Task SaveAsync() => _repositoryContext.SaveChangesAsync();

        public void Save()
        {
            _repositoryContext.SaveChanges();
        }
    }
}
