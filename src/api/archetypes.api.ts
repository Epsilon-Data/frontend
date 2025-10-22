import { ARCHETYPE_API_URL } from '@app/constants/template';
import { httpClient, getCsrfHeader } from './http.api';
import { Node, Edge } from '@xyflow/react';

export interface Archetype {
  id: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  lastModified: Date;
  status: string;
}

export type Permission = {
  id: string;
  permission: 'DETAILED' | 'HIGH';
};

export interface ArchetypeInfo {
  projectId: string;
  archetypeId?: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  permissions?: Permission[];
  status: 'DRAFT' | 'ACTIVE';
}

export const getArchetypes = async (projectId: string | undefined): Promise<Archetype[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${ARCHETYPE_API_URL}/${projectId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const createArchetype = async (data: ArchetypeInfo): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.post(`${ARCHETYPE_API_URL}/${data.projectId}`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};

export const deleteTemplate = async (projectId: string | undefined, templateId: string): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.delete(`${ARCHETYPE_API_URL}/${projectId}/${templateId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};
