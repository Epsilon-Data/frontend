import {
  httpClient,
  getLoginUrl,
  getUserInfo,
  getUserClaims,
  refreshToken,
  logout,
  handlePageLoad,
} from '@app/api/http.api';

import './mocks/auth.api.mock';
import { UserModel } from '@app/domain/UserModel';

export interface AuthData {
  email: string;
  password: string;
}

export interface SignUpRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface ResetPasswordRequest {
  email: string;
}

export interface SecurityCodePayload {
  code: string;
}

export interface NewPasswordData {
  newPassword: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  user: UserModel;
}

export const login = async (currentPath: string) => {
  // httpApi.post<LoginResponse>('login', { ...loginPayload }).then(({ data }) => data);
  return await getLoginUrl(currentPath);
};
export const signUp = (signUpData: SignUpRequest): Promise<undefined> =>
  httpClient.post<undefined>('signUp', { ...signUpData }).then(({ data }) => data);

export const fetchUserInfo = async () => {
  return await getUserInfo();
};

export const fetchClaims = async (csrf: string) => {
  return await getUserClaims(csrf);
};

export const refresh = async (csrf: string) => {
  await refreshToken(csrf);
};

export const resetPassword = (resetPasswordPayload: ResetPasswordRequest): Promise<undefined> =>
  httpClient.post<undefined>('forgotPassword', { ...resetPasswordPayload }).then(({ data }) => data);

export const verifySecurityCode = (securityCodePayload: SecurityCodePayload): Promise<undefined> =>
  httpClient.post<undefined>('verifySecurityCode', { ...securityCodePayload }).then(({ data }) => data);

export const setNewPassword = (newPasswordData: NewPasswordData): Promise<undefined> =>
  httpClient.post<undefined>('setNewPassword', { ...newPasswordData }).then(({ data }) => data);

export const signOut = async (csrf: string) => {
  const { url } = await logout(csrf);
  window.location.href = url;
};

export const doPageLoad = async (query: URLSearchParams) => {
  const state = query.get('state') || '';
  const code = query.get('code') || '';
  return await handlePageLoad(state, code);
};
