import AxiosMockAdapter from 'axios-mock-adapter';
import { httpClient } from '@app/api/http.api';

export const httpApiMock = new AxiosMockAdapter(httpClient, { delayResponse: 1000 });
