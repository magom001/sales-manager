import axios from 'axios';

import { applyInterceptors } from 'axios-jwt-auth';
import { refreshTokens } from './auth';

export const axiosInstance = axios.create({ baseURL: '/api/v1' });

applyInterceptors(axiosInstance, {
  refreshTokens: (token) => refreshTokens(token),
});
