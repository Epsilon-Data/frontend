import { ARCHETYPE_API_URL } from '@app/constants/archetype';
import { httpClient, getCsrfHeader } from './http.api';
import { Node, Edge } from '@xyflow/react';

type ArchetypeStatus = 'DRAFT' | 'PUBLISHED' | 'ACTIVE';

export interface Archetype {
  id: string;
  name: string;
  lastModified: Date;
  created: Date;
  createdBy: string;
  status: ArchetypeStatus;
}

export type Permission = {
  id: string;
  permission: 'DETAILED' | 'HIGH_LEVEL' | 'NONE';
};

export interface ArchetypeInfo {
  projectId: string;
  archetypeId?: string;
  name: string;
  nodes: Node[];
  edges: Edge[];
  permissions?: Permission[];
  status: ArchetypeStatus;
  lastModified?: Date;
}

export const getArchetypes = async (projectId: string | undefined): Promise<Archetype[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${ARCHETYPE_API_URL}/${projectId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};

export const getArchetypeDetails = async (
  projectId: string | undefined,
  archetypeId: string | undefined,
): Promise<ArchetypeInfo> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${ARCHETYPE_API_URL}/${projectId}/${archetypeId}`, {
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

export const updateArchetype = async (
  projectId: string | undefined,
  archetypeId: string,
  data: ArchetypeInfo,
): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.put(`${ARCHETYPE_API_URL}/${projectId}/${archetypeId}`, data, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};

export const deleteArchetype = async (projectId: string | undefined, archetypeId: string): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  await httpClient.delete(`${ARCHETYPE_API_URL}/${projectId}/${archetypeId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });
};
