import { PROJECT_API_URL } from '@app/constants/projects';
import { getCsrfHeader, httpClient } from './http.api';

const PROXY_API_URL = PROJECT_API_URL.replace('/project', '/proxy');

export interface ProxyStatus {
  proxyId: string;
  status: 'PENDING' | 'ONLINE' | 'OFFLINE';
  version?: string;
  lastSeenAt?: string;
  assignedPort?: number;
}

export interface InstallTokenSummary {
  id: string;
  name: string;
  tokenPrefix: string;
  createdAt: string;
  lastUsedAt?: string;
}

export interface GenerateTokenResponse {
  id: string;
  name: string;
  installToken: string;
  tokenPrefix: string;
  createdAt: string;
}

export const generateProxyToken = async (projectId: string, name: string): Promise<GenerateTokenResponse> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(
    `${PROXY_API_URL}/${projectId}/token`,
    { name },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
  return response.data;
};

export const listProxyTokens = async (projectId: string): Promise<InstallTokenSummary[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${PROXY_API_URL}/${projectId}/tokens`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const revokeProxyToken = async (projectId: string, tokenId: string): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.delete(`${PROXY_API_URL}/${projectId}/tokens/${tokenId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};

export const getProxyStatus = async (projectId: string): Promise<ProxyStatus> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${PROXY_API_URL}/${projectId}/status`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};

export const deleteProxy = async (projectId: string): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.delete(`${PROXY_API_URL}/${projectId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};
