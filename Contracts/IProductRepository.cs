using System.Collections.Generic;
using Entities.Models;

namespace Contracts
{
    public interface IProductRepository: IRepositoryBase<Product>
    {
        IEnumerable<Product> GetAllProducts(bool trackChanges);
    }
}
