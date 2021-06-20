import axios from 'axios';
import { applyAuthTokenInterceptor } from './axios-jwt';

export const axiosInstance = axios.create({ baseURL: '/api/v1' });

applyAuthTokenInterceptor(axiosInstance, {});
