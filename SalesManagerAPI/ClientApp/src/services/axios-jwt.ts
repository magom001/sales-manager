// WIP!
// TODO: handle concurrent requests with 401 response

import { AxiosError, AxiosInstance, AxiosRequestConfig } from 'axios';
import { refreshTokens } from './auth';

type Token = string;
interface IAuthTokens {
  accessToken: Token;
  refreshToken: Token;
}
interface ITokensStorage {
  saveTokens(tokens:IAuthTokens):Promise<void>;
  clearTokens():Promise<void>;
  getAccessToken():Promise<Token>;
  getRefreshToken():Promise<Token>;
}

const ACCESS_KEY_LS_KEY = 'accessToken';
const REFRESH_KEY_LS_KEY = 'refreshToken';

class LocalStorageTokensStorage implements ITokensStorage {
  private static ACCESS_KEY_LS_KEY = 'accessToken';
  private static REFRESH_KEY_LS_KEY = 'refreshToken';

  async saveTokens(tokens: IAuthTokens): Promise<void> {
    localStorage.setItem(ACCESS_KEY_LS_KEY, tokens.accessToken);
    localStorage.setItem(REFRESH_KEY_LS_KEY, tokens.refreshToken);
  }

  async clearTokens(): Promise<void> {
    localStorage.removeItem(ACCESS_KEY_LS_KEY);
    localStorage.removeItem(REFRESH_KEY_LS_KEY);
  }

  async getAccessToken(): Promise<string> {
    return localStorage.getItem(LocalStorageTokensStorage.ACCESS_KEY_LS_KEY);
  }

  async getRefreshToken(): Promise<string> {
   return localStorage.getItem(LocalStorageTokensStorage.REFRESH_KEY_LS_KEY);
  }

}

const tokensStorage = new LocalStorageTokensStorage();


export const setAuthTokens = (tokens: IAuthTokens): void => {
  localStorage.setItem(ACCESS_KEY_LS_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY_LS_KEY, tokens.refreshToken);
};


export const applyAuthTokenInterceptor = (axios: AxiosInstance, config: IAuthTokenInterceptorConfig): void => {
  if (!axios.interceptors) throw new Error(`invalid axios instance: ${axios}`);
  axios.interceptors.request.use(authTokenInterceptor(config));
  axios.interceptors.response.use(undefined, async (e: AxiosError) => {
    if (e.response?.status === 401) {
      try {
        isRefreshing = true;
        const refreshToken = await tokensStorage.getRefreshToken();
        if(!refreshToken) {
          throw e;
        }

        const tokens = await refreshTokens(refreshToken);

        await tokensStorage.saveTokens(tokens);

        resolveQueue(tokens.accessToken);

        return axios.request(e.config);
      } catch (error) {
        console.error('applyAuthTokenInterceptor:error', error);
        declineQueue(error);

        await tokensStorage.clearTokens();

        throw error;
      } finally {
        isRefreshing = false;
      }
    } else {
      return e;
    }
  });
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

    const accessToken = await tokensStorage.getAccessToken();

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
