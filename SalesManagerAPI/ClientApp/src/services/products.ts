import { axiosInstance } from './axios';

interface ProductDto {
  id: string;
  name: string;
  unit: string;
}

export const getProducts = async () => {
  const { data } = await axiosInstance.get<ProductDto[]>('/products');

  return data;
};
