import { AnalysisInfo } from '@app/api/analysis.api';

export const DATE_FORMAT = 'dd/MM/yyyy';
export const ANALYSIS_API_URL = '/hub/analysis';

export const INITIAL_DETAIL_VALUES: AnalysisInfo = {
  id: '',
  name: '',
  description: '',
  scripts: [],
};
