import { JOB_API_URL } from '@app/constants/job';
import { Node, Edge } from '@xyflow/react';
import { getCsrfHeader, httpClient } from './http.api';

export const getUploadJobStatus = async (
  jobId: string,
): Promise<{
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: { nodes: Node[]; edges: Edge[] };
  error?: string;
}> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${JOB_API_URL}/${jobId}/status`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};
