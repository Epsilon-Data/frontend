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
export const getDatasetList = async (pagination: Pagination): Promise<DatasetListData> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(DATASET_API_URL + 'list', {
    headers: { [csrfHeaderName]: `${csrf}` },
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
  // const { csrfHeaderName, csrf } = getCsrfHeader();
  // const response = await httpClient.post(DATASET_API_URL + 'descriptive', analysis, {
  //   headers: { [csrfHeaderName]: `${csrf}` },
  // });
  const SAMPLE = [
    {
      name: 'health_11',
      frequency: {
        good: 40,
        moderate: 50,
        bad: 10,
        invalid: 0,
      },
      mean: 50.2,
      median: 51,
      mode: 52,
      sd: 4.5,
      var: 20.25,
      min: 40,
      max: 60,
    },
    {
      name: 'school_4f',
      frequency: {
        yes: 60,
        no: 30,
        invalid: 10,
      },
      mean: 45.3,
      median: 45,
      mode: 44,
      sd: 3.8,
      var: 14.44,
      min: 37,
      max: 52,
    },
    {
      name: 'illness_3',
      frequency: {
        yes: 60,
        no: 30,
        invalid: 10,
      },
      mean: 30.1,
      median: 30,
      mode: 29,
      sd: 2.7,
      var: 7.29,
      min: 25,
      max: 35,
    },
    {
      name: 'residents_language',
      frequency: {
        english: 60,
        malay: 40,
        mandarin: 30,
        invalid: 0,
      },
      mean: 20.5,
      median: 21,
      mode: 22,
      sd: 3.0,
      var: 9.0,
      min: 15,
      max: 26,
    },
    {
      name: 'health_13a',
      frequency: {
        good: 40,
        moderate: 50,
        bad: 10,
        invalid: 0,
      },
      mean: 60.7,
      median: 61,
      mode: 62,
      sd: 5.2,
      var: 27.04,
      min: 50,
      max: 70,
    },
    {
      name: 'diabetes_2',
      frequency: {
        yes: 60,
        no: 30,
        invalid: 10,
      },
      mean: 35.8,
      median: 36,
      mode: 35,
      sd: 2.9,
      var: 8.41,
      min: 30,
      max: 40,
    },
    {
      name: 'tech_4',
      frequency: {
        yes: 60,
        no: 30,
        invalid: 10,
      },
      mean: 25.4,
      median: 25,
      mode: 26,
      sd: 3.3,
      var: 10.89,
      min: 20,
      max: 31,
    },
    {
      name: 'cr_ch_01',
      frequency: {
        yes: 60,
        no: 30,
        invalid: 10,
      },
      mean: 15.9,
      median: 16,
      mode: 16,
      sd: 2.5,
      var: 6.25,
      min: 12,
      max: 20,
    },
    {
      name: 'ethnicity',
      frequency: {
        malay: 50,
        chinese: 25,
        indian: 15,
        others: 10,
        invalid: 0,
      },
      mean: 15.9,
      median: 16,
      mode: 16,
      sd: 2.5,
      var: 6.25,
      min: 12,
      max: 20,
    },
    {
      name: 'age',
      frequency: {
        30: 5,
        31: 5,
        33: 6,
        34: 6,
        39: 2,
        40: 1,
        invalid: 5,
      },
      mean: 35.6,
      median: 34,
      mode: 33.5,
      sd: 2.5,
      var: 6.25,
      min: 30,
      max: 40,
    },
  ];

  let rmdString = '';

  analysis.variables.forEach((variable) => {
    const item: any = SAMPLE.find((item) => item.name === variable.name);

    if (!item) {
      return null;
    }

    if (variable.type === 'ord') {
      rmdString += `#### ${variable.name} (Ordinal)\n\n`;
      rmdString += '|        | ' + variable.name + ' |\n';
      rmdString += '|:-------|:-----:|\n';
      analysis.calculate.forEach((calc) => {
        if (item.hasOwnProperty(calc)) {
          rmdString += `| ${t(`dataset.standard.descriptive.calculate.${calc}`)} | ${item[calc]} |\n`;
        }
      });
      rmdString += '\n&nbsp;\n';
    } else if (variable.type === 'nom') {
      rmdString += `#### ${variable.name} (Nominal)\n\n`;
      rmdString += '|         | ' + variable.name + ' |\n';
      rmdString += '|:--------|:-----:|\n';
      const frequency = item.frequency || {};
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
