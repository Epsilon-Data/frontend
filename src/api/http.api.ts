import { authClient, AuthClientOptionsDto } from '@epsilon-data/epsilon-auth-client';

import { AxiosError, AxiosRequestConfig } from 'axios';

import config from '@app/config/config';
import { ApiError, ApiErrorData } from './ApiError';
import { readCsrf } from '@app/services/localStorage.service';

export type ApiErrorEvent = {
  message: string;
  status?: number;
  data?: unknown;
  retry?: () => void;
};

type Listener = (payload: ApiErrorEvent) => void;

class ErrorBus {
  private listeners: Listener[] = [];

  on(listener: Listener) {
    this.listeners.push(listener);
    return () => this.off(listener);
  }

  off(listener: Listener) {
    this.listeners = this.listeners.filter((l) => l !== listener);
  }

  emit(payload: ApiErrorEvent) {
    const copy = [...this.listeners];
    for (const l of copy) {
      try {
        l(payload);
      } catch {}
    }
  }
}

export const errorBus = new ErrorBus();

const clientOptions: AuthClientOptionsDto = {
  tokenHandlerUri: `${config.apiPrefix}/token`,
  cookiePrefix: config.cookiePrefix,
  refreshExpiringTokens: true,
  refreshThresholdSeconds: 30,
  reauthenticateOnUnauthorizedError: true,
};

const httpClientOptions: AxiosRequestConfig = {
  baseURL: config.apiPrefix,
  // Use this to add any additional headers
  headers: {},
};

const getCsrfHeader = () => {
  return { csrfHeaderName: `x-${config.cookiePrefix}-csrf`, csrf: readCsrf() };
};

const { getLoginUrl, handlePageLoad, getUserInfo, getUserClaims, refreshToken, logout, httpClient } = authClient(
  clientOptions,
  httpClientOptions,
);

httpClient.interceptors.response.use(undefined, (error: AxiosError) => {
  const suppress =
    (error.config as AxiosRequestConfig & { suppressErrorRedirect?: boolean })?.suppressErrorRedirect === true;

  const responseData = error.response?.data as ApiErrorData | undefined;
  const message = responseData?.message || error.message || 'Unknown error';

  if (!suppress) {
    errorBus.emit({
      message,
      status: error.response?.status,
      data: responseData,
    });
  }

  throw new ApiError<ApiErrorData>(message, responseData);
});

export {
  getLoginUrl,
  handlePageLoad,
  getUserInfo,
  getUserClaims,
  refreshToken,
  logout,
  httpClient,
  getCsrfHeader,
  ApiError,
};
