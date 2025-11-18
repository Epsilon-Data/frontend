export const DATE_FORMAT = 'dd/MM/yyyy';
export const ANALYSIS_REQUEST_API_URL = '/hub/analysis-request';

export const STATUS_COLORS: { [key: string]: string } = {
  PENDING: '#FFEE8C',
  REJECTED: '#AEAEAE',
  REVISION: '#50C878',
  APPROVED: '#AEAEAE',
};

export const STATUS_NAMES: { [key: string]: string } = {
  PENDING: 'In Review',
  REJECTED: 'Rejected',
  REVISION: 'Revision Required',
  APPROVED: 'Approved',
};
