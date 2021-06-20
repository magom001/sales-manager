import axios from 'axios';
import { axiosInstance } from './api';

interface UserDto {
  firstName: string;
  lastName: string;
  username: string;
  roles: string[];
}

export const checkAuth = async () => {
  const { data } = await axiosInstance.get<UserDto>('/auth/whoami');

  return data;
};

interface TokensDto {
  accessToken: string;
  refreshToken: string;
}
export const refreshTokens = async (refreshToken: string) => {
  const { data } = await axios.post<TokensDto>('/api/v1/auth/refresh', { refreshToken });

  return data;
};
