import { axiosInstance } from './api';

interface ProductDto {
  id: string;
  name: string;
  unit: string;
}

export const getProducts = async () => {
  const { data } = await axiosInstance.get<ProductDto[]>('/products');

  return data;
};
