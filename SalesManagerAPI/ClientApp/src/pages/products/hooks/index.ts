import { getProducts } from './../../../services/products';
import { useQuery } from 'react-query';

export const useProducts = () => {
  return useQuery('products', getProducts, {
    suspense: false,
  });
};
