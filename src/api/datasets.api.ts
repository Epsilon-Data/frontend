/* eslint-disable @typescript-eslint/no-explicit-any */
import { DATASET_API_URL, DATE_FORMAT } from '@app/constants/datasets';
import { Priority } from '@app/constants/enums/priorities';
import { format } from 'date-fns';
import { getCsrfHeader, httpClient } from './http.api';
import { RcFile } from 'antd/lib/upload';
import { DescriptiveAnalysis } from '@app/interfaces/interfaces';
import { t } from 'i18next';

export interface Tag {
  value: string;
  priority: Priority;
}

export interface Pagination {
  current?: number;
  pageSize?: number;
  total?: number;
}

export interface DatasetListItem {
  id: string;
  projectId: string;
  projectCustomId: string;
  projectName: string;
  connectDate: string;
}

export interface AnalysisTableRow {
  key: number;
  id: string;
  name: string;
  createdDate: string;
  updatedDate: string;
  lastUpdated: string;
}

export interface DatasetListData {
  data: DatasetListItem[];
  pagination: Pagination;
}

export interface AnalysisTableData {
  data: AnalysisTableRow[];
  pagination: Pagination;
}

export interface ScriptInfo {
  key: number;
  id: string;
  name: string;
  status: number;
  statusMsg: string;
  lastUpdated: string;
  executionSettings: string | null;
}

export interface AnalysisInfo {
  id: string;
  name: string;
  description: string;
  scripts: ScriptInfo[];
}
export const getDatasetList = async (userId: string | undefined, pagination: Pagination): Promise<DatasetListData> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATASET_API_URL + 'list', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      userId: userId,
    },
  });

  const formattedData = response.data.map(
    (item: { id: string; projectId: string; projectCustomId: string; projectName: string; connectDate: Date }) => {
      return {
        ...item,
        connectDate: item.connectDate ? format(item.connectDate, DATE_FORMAT) : '-',
      };
    },
  );

  return { data: formattedData, pagination: { ...pagination, total: formattedData.length } };
};

export const getAnalysisTableData = async (
  pagination: Pagination,
  userRequestId: string | undefined,
): Promise<AnalysisTableData> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATASET_API_URL + 'analysis-list', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      userRequestId: userRequestId,
    },
  });

  const formattedData = response.data.map(
    (
      item: {
        id: string;
        name: string;
        createdDate: Date;
        lastUpdated: Date;
        lastUpdatedUser: string;
      },
      index: number,
    ) => {
      return {
        key: index + 1,
        id: item.id,
        name: item.name,
        createdDate: format(item.createdDate, DATE_FORMAT),
        updatedDate: format(new Date(item.lastUpdated), DATE_FORMAT + "', ' h.mma"),
        lastUpdated: item.lastUpdatedUser,
      };
    },
  );
  return {
    data: formattedData,
    pagination: { ...pagination, total: formattedData.length },
  };
};

export const createAnalysis = async (userRequestId: string | undefined, name: string): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(
    DATASET_API_URL + 'create-analysis',
    { userRequestId: userRequestId, name: name },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
  return response.data;
};

export const deleteAnalysis = async (analysisId: string | undefined): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.delete(DATASET_API_URL + 'delete-analysis', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      analysisId: analysisId,
    },
  });

  return response.data;
};

export const uploadScript = async (analysisId: string | undefined, file: string | Blob | RcFile): Promise<Buffer> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const formData = new FormData();
  formData.append('file', file);
  const response = await httpClient.post(DATASET_API_URL + 'upload-script', formData, {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      analysisId: analysisId,
    },
  });
  return response.data;
};

export const getAnalysisDetails = async (analysisId: string | undefined): Promise<AnalysisInfo | undefined> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATASET_API_URL + 'analysis-details', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      analysisId: analysisId,
    },
  });

  return {
    id: response.data.id,
    name: response.data.name,
    description: response.data.description ?? 'No description specified.',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    scripts: response.data.Script.map((script: any, index: number) => ({
      key: index + 1,
      id: script.id,
      name: script.name,
      status: script.status,
      statusMsg: script.statusMsg,
      lastUpdated: format(script.lastUpdated, DATE_FORMAT) + ', ' + script.lastUpdatedUser,
      executionSettings: script.executionSettings,
    })),
  };
};

export const deleteScript = async (scriptId: string | undefined): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.delete(DATASET_API_URL + 'delete-script', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      scriptId: scriptId,
    },
  });

  return response.data;
};

export const viewReport = async (scriptId: string | undefined): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATASET_API_URL + 'view-report', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      scriptId: scriptId,
    },
  });

  const link = document.createElement('a');
  link.href = response.data;
  link.setAttribute('download', 'report.html');
  document.body.appendChild(link);
  link.click();
  link.remove();
};

export const getAnalysisColumns = async (userRequestId: string | undefined): Promise<string[]> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATASET_API_URL + 'columns', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      userRequestId: userRequestId,
    },
  });

  return response.data;
};

export const getDescriptive = async (analysis: DescriptiveAnalysis): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(DATASET_API_URL + 'descriptive', analysis, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  let rmdString = '';

  response.data.forEach((output: any) => {
    if (output.type === 'ord') {
      rmdString += `#### ${output.name} (Ordinal)\n\n`;
      rmdString += '|        | ' + output.name + ' |\n';
      rmdString += '|:-------|---------:|\n';
      analysis.calculate.forEach((calc) => {
        rmdString += `| ${t(`dataset.standard.descriptive.calculate.${calc}`)} | ${output[calc]} |\n`;
      });
      rmdString += '\n&nbsp;\n';
    } else if (output.type === 'nom') {
      rmdString += `#### ${output.name} (Nominal)\n\n`;
      rmdString += '|         | ' + output.name + ' |\n';
      rmdString += '|:--------|--------:|\n';
      const frequency = output.frequency || {};
      let totalFrequency = 0;
      let invalidFrequency = 0;
      Object.keys(frequency).forEach((category) => {
        if (category === 'invalid') {
          invalidFrequency = frequency[category];
        } else {
          totalFrequency += frequency[category];
          rmdString += `| ${category} | ${frequency[category]} |\n`;
        }
      });
      rmdString += `| Valid   | ${totalFrequency} |\n`;
      rmdString += `| Invalid | ${invalidFrequency} |\n`;
      rmdString += `| Total   | ${totalFrequency + invalidFrequency} |\n&nbsp;\n`;
    }
  });
  return rmdString;
};

export const getScriptMapping = async (scriptId: string | undefined): Promise<any> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATASET_API_URL + 'get-script-mapping', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      scriptId: scriptId,
    },
  });

  return response.data;
};

export const addScriptMapping = async (scriptId: string | undefined, mapping: any): Promise<any> => {
  const jsonMapping = JSON.stringify(mapping);
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(
    DATASET_API_URL + 'add-script-mapping',
    { data: jsonMapping },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
      params: {
        scriptId: scriptId,
      },
    },
  );
  return response.data;
};

export const downloadDataset = async (userRequestId: string | undefined): Promise<void> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATASET_API_URL + 'download-dataset', {
    headers: { [csrfHeaderName]: `${csrf}` },
    params: {
      userRequestId: userRequestId,
    },
    responseType: 'blob',
  });

  const url = window.URL.createObjectURL(new Blob([response.data]));
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', 'dataset.zip'); // or the file name you expect from the server
  document.body.appendChild(link);
  link.click();
  link.remove();
};
