import { TOKEN_API_URL } from '@app/constants/token';
import { getCsrfHeader, httpClient } from './http.api';

export interface AccessTokenInfo {
  id?: string;
  name: string;
  expiry: Date;
  token: string;
  loading?: boolean;
}

export const generateToken = async (name: string): Promise<AccessTokenInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${TOKEN_API_URL}/${name}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  console.log(response);
  return { name: name, expiry: new Date(), token: 'abc' };
};

export const getTokenList = async (): Promise<AccessTokenInfo[]> => {
  // const { csrfHeaderName, csrf } = getCsrfHeader();
  // const response = await httpClient.get(`${TOKEN_API_URL}`, {
  //   headers: { [csrfHeaderName]: `${csrf}` },
  // });

  return [
    { id: '1', name: 'abc', expiry: new Date(), token: 'abc' },
    { id: '2', name: 'def', expiry: new Date(), token: 'def' },
    { id: '3', name: 'ghi', expiry: new Date(), token: 'ghi' },
  ];
};
