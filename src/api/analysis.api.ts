import { ANALYSIS_API_URL, DATE_FORMAT } from '@app/constants/analysis';
import { getCsrfHeader, httpClient } from './http.api';
import { DescriptiveAnalysis } from '@app/interfaces/interfaces';
import { format } from 'date-fns';
import { t } from 'i18next';

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

export const createAnalysis = async (userRequestId: string | undefined, name: string): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(
    ANALYSIS_API_URL,
    { userRequestId: userRequestId, name: name },
    {
      headers: { [csrfHeaderName]: `${csrf}` },
    },
  );
  return response.data;
};

export const getAnalysisDetails = async (analysisId: string | undefined): Promise<AnalysisInfo | undefined> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.get(`${ANALYSIS_API_URL}/${analysisId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
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

export const getDescriptive = async (analysis: DescriptiveAnalysis): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.post(`${ANALYSIS_API_URL}/descriptive`, analysis, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  let rmdString = '';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

export const deleteAnalysis = async (analysisId: string | undefined): Promise<string> => {
  const { csrfHeaderName, csrf } = getCsrfHeader();
  const response = await httpClient.delete(`${ANALYSIS_API_URL}/${analysisId}`, {
    headers: { [csrfHeaderName]: `${csrf}` },
  });

  return response.data;
};
