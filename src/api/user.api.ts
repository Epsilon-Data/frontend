import { httpClient, getCsrfHeader } from './http.api';

export const isAdmin = async (): Promise<boolean> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get('/hub/user/admin', {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
  return response.data;
};
