import { Token } from 'axios-jwt-auth';

export interface IAuthTokens {
  accessToken: Token;
  refreshToken: Token;
}

const ACCESS_KEY_LS_KEY = 'accessToken';
const REFRESH_KEY_LS_KEY = 'refreshToken';

export const setAuthTokens = (tokens: IAuthTokens): void => {
  localStorage.setItem(ACCESS_KEY_LS_KEY, tokens.accessToken);
  localStorage.setItem(REFRESH_KEY_LS_KEY, tokens.refreshToken);
};
