using System.Collections.Generic;
using AutoMapper;
using Contracts;
using Entities.DataTransferObjects;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace SalesManagerAPI.Controllers
{
    [ApiController]
    [Route("api/v{version:ApiVersion}/products")]
    [ApiVersion("1.0")]
    [Authorize(Roles = "Admin")]
    public class Products : ControllerBase
    {
        private readonly IRepositoryManager _repository;

        private readonly IMapper _mapper;

        public Products(IRepositoryManager repository, IMapper mapper) : base()
        {
            _repository = repository;
            _mapper = mapper;
        }

        [HttpGet]
        public IActionResult GetProducts()
        {
            var products = _repository.Product.GetAllProducts(false);

            var productsDto = _mapper.Map<IEnumerable<ProductDto>>(products);

            return Ok(productsDto);
        }
    }
}
