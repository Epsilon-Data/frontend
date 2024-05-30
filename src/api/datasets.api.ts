import { DATASET_API_URL, DATE_FORMAT } from '@app/constants/datasets';
import { Priority } from '@app/constants/enums/priorities';
import { format } from 'date-fns';
import { getCsrfHeader, httpClient } from './http.api';

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
    (item: { projectId: string; projectCustomId: string; projectName: string; connectDate: Date }) => {
      return {
        ...item,
        connectDate: item.connectDate ? format(item.connectDate, DATE_FORMAT) : '-',
      };
    },
  );

  return { data: formattedData, pagination: { ...pagination, total: formattedData.length } };
};

export const getAnalysisTableData = async (pagination: Pagination): Promise<AnalysisTableData> => {
  // const { csrfHeaderName, csrf } = getCsrfHeader();
  // const response = await httpClient.get(DATASET_API_URL + 'analysis-list', {
  //   headers: { [csrfHeaderName]: `${csrf}` },
  // });

  const response = {
    data: {
      requests: [
        {
          id: '1',
          name: 'Analysis 1',
          createdDate: new Date('2024/05/11'),
          updatedDate: new Date('2024/05/12'),
          lastUpdated: 'User ABC',
        },
        {
          id: '2',
          name: 'Analysis 2',
          createdDate: new Date('2024/05/12'),
          updatedDate: new Date('2024/05/12'),
          lastUpdated: 'Test3 Researcher',
        },
      ],
    },
  };

  const formattedData = response.data.requests.map(
    (
      item: {
        id: string;
        name: string;
        createdDate: Date;
        updatedDate: Date;
        lastUpdated: string;
      },
      index: number,
    ) => {
      return {
        key: index + 1,
        id: item.id,
        name: item.name,
        createdDate: format(item.createdDate, DATE_FORMAT),
        updatedDate: format(item.updatedDate, DATE_FORMAT),
        lastUpdated: item.lastUpdated,
      };
    },
  );
  return {
    data: formattedData,
    pagination: { ...pagination, total: formattedData.length },
  };
};

export const getAnalysisDetails = (analysisId: string | undefined): Promise<AnalysisInfo | undefined> => {
  // const { csrfHeaderName, csrf } = getCsrfHeader();
  // const response = await httpClient.get(DATASET_API_URL + 'analysis-details', {
  //   headers: { [csrfHeaderName]: `${csrf}` },
  // });

  const response: { data: AnalysisInfo[] } = {
    data: [
      {
        id: '1',
        name: 'Analysis 1',
        description: 'Analysis 1 description',
        scripts: [
          {
            key: 1,
            name: 'exampleScript.R',
            status: 3,
            statusMsg: 'Passed all script checks!',
            lastUpdated: '14/05/2024, Test1 User',
            executionSettings: null,
          },
          {
            key: 2,
            name: 'script1.R',
            status: 2,
            statusMsg: 'File contains error at line 4',
            lastUpdated: '13/05/2024, Test2 User',
            executionSettings: null,
          },
        ],
      },
      {
        id: '2',
        name: 'Analysis 2',
        description: 'Analysis 2 description',
        scripts: [
          {
            key: 1,
            name: 'exampleScript.R',
            status: 3,
            statusMsg: 'Passed all script checks!',
            lastUpdated: '12/05/2024, Test3 User',
            executionSettings: null,
          },
        ],
      },
    ],
  };

  const output = response.data.find((item) => item.id === analysisId);

  output?.scripts?.forEach((script) => {
    if (script.executionSettings === null) {
      script.executionSettings = 'No execution settings set.';
    }
  });

  return Promise.resolve(output);
};
