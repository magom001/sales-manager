// WIP!
// TODO: handle concurrent requests with 401 response

import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { refreshTokens } from './auth';

const ACCESS_KEY_LS_KEY = 'accessToken';
const REFRESH_KEY_LS_KEY = 'refreshToken';

type Token = string;
interface IAuthTokens {
  accessToken: Token;
  refreshToken: Token;
}

const setAuthTokens = (tokens: IAuthTokens): void => {
  localStorage.setItem(ACCESS_KEY_LS_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY_LS_KEY, tokens.refreshToken);
};

/**
 * Clears both tokens
 */
const clearAuthTokens = (): void => {
  localStorage.removeItem(ACCESS_KEY_LS_KEY);
  localStorage.removeItem(REFRESH_KEY_LS_KEY);
};

/**
 * Returns the stored refresh token
 * @returns {string} Refresh token
 */
const getRefreshToken = (): Token | undefined => {
  const tokens = getAuthTokens();
  return tokens ? tokens.refreshToken : undefined;
};

/**
 * Returns the stored access token
 * @returns {string} Access token
 */
const getAccessToken = (): Token | undefined => {
  const tokens = getAuthTokens();
  return tokens ? tokens.accessToken : undefined;
};

export const applyAuthTokenInterceptor = (axios: AxiosInstance, config: IAuthTokenInterceptorConfig): void => {
  if (!axios.interceptors) throw new Error(`invalid axios instance: ${axios}`);
  axios.interceptors.request.use(authTokenInterceptor(config));
  axios.interceptors.response.use(undefined, async (e: AxiosError) => {
    if (e.response?.status === 401) {
      try {
        isRefreshing = true;
        const tokens = await refreshTokens(getRefreshToken());

        setAuthTokens(tokens);

        resolveQueue(tokens.accessToken);

        return axios.request(e.config);
      } catch (error) {
        console.error('applyAuthTokenInterceptor:error', error);
        declineQueue(error);
        clearAuthTokens();
      } finally {
        isRefreshing = false;
      }
    } else {
      return e;
    }
  });
};

const getAuthTokens = (): IAuthTokens | undefined => {
  const accessToken = localStorage.getItem(ACCESS_KEY_LS_KEY);
  const refreshToken = localStorage.getItem(REFRESH_KEY_LS_KEY);

  return { accessToken, refreshToken };
};

interface IAuthTokenInterceptorConfig {
  header?: string;
  headerPrefix?: string;
}

const authTokenInterceptor =
  ({ header = 'Authorization', headerPrefix = 'Bearer' }: IAuthTokenInterceptorConfig) =>
  async (requestConfig: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        queue.push({ resolve, reject });
      })
        .then((token: string) => {
          requestConfig.headers[header] = `${headerPrefix}${token}`;
          return requestConfig;
        })
        .catch(Promise.reject);
    }

    const accessToken = getAccessToken();

    requestConfig.headers[header] = `${headerPrefix} ${accessToken}`;

    return requestConfig;
  };

type RequestsQueue = {
  resolve: (value?: unknown) => void;
  reject: (reason?: unknown) => void;
}[];

let isRefreshing = false;
let queue: RequestsQueue = [];

const resolveQueue = (token?: Token) => {
  queue.forEach((p) => {
    p.resolve(token);
  });

  queue = [];
};

const declineQueue = (error: Error) => {
  queue.forEach((p) => {
    p.reject(error);
  });

  queue = [];
};
