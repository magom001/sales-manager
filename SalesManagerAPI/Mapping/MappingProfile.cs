using AutoMapper;
using Entities.DataTransferObjects;
using Entities.Models;

namespace SalesManagerAPI.Mapping
{
    public class MappingProfile: Profile
    {
        public MappingProfile()
        {
            CreateMap<Product, ProductDto>();
        }
    }
}
