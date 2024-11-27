import { TEMPLATE_API_URL } from '@app/constants/template';
import { httpClient, getCsrfHeader } from './http.api';
import { Template } from '@app/interfaces/interfaces';

export const getTemplateNames = async (projectId: string | undefined): Promise<{ guid: string; name: string }[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${TEMPLATE_API_URL}/${projectId}/names`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const getTemplates = async (projectId: string | undefined): Promise<Template[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${TEMPLATE_API_URL}/${projectId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const deleteTemplate = async (projectId: string | undefined, templateId: string): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.delete(`${TEMPLATE_API_URL}/${projectId}/${templateId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};

export const createTemplate = async (
  projectId: string | undefined,
  columnMapping: string,
  template: string,
): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.post(
    `${TEMPLATE_API_URL}/${projectId}`,
    { projectId: projectId, columnMapping: columnMapping, template: template },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
};
