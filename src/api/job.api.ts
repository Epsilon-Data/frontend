import { JOB_API_URL } from '@app/constants/job';
import { Node, Edge } from '@xyflow/react';
import { getCsrfHeader, httpClient } from './http.api';

export type GraphNodePayload = {
  id: string;
  label: string;
  depth: number;
  colour?: string;
};

export type GraphEdgePayload = {
  source: string;
  target: string;
};

export const getUploadJobStatus = async (
  jobId: string,
): Promise<{
  status: 'pending' | 'completed' | 'error';
  result?: { nodes: GraphNodePayload[]; edges: GraphEdgePayload[] };
  error?: string;
}> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${JOB_API_URL}/${jobId}/status`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};
