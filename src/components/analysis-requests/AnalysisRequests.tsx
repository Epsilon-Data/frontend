import { Button, Table, TableProps, Tag } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import relativeTime from 'dayjs/plugin/relativeTime';
import { RequestSummaryInfo } from '@app/api/analysisRequests.api';
import { STATUS_COLORS, STATUS_NAMES } from '@app/constants/analysisRequest';
import { useNavigate } from 'react-router-dom';

dayjs.extend(relativeTime);

type AnalysisRequestsProps = {
  loading: boolean;
  analysisRequests: RequestSummaryInfo[];
};

export const AnalysisRequests = ({ loading, analysisRequests }: AnalysisRequestsProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const renderDate = (value: string | Date) => {
    const now = dayjs();
    const modified = dayjs(value);

    const daysDiff = now.diff(modified, 'day');
    const monthsDiff = now.diff(modified, 'month');

    if (daysDiff === 0) {
      return <span className="font-light">{'today'}</span>;
    }

    if (monthsDiff >= 1) {
      const remainingDays = now.diff(modified.add(monthsDiff, 'month'), 'day');
      return `${monthsDiff} month${monthsDiff > 1 ? 's' : ''}${
        remainingDays > 0 ? `, ${remainingDays} day${remainingDays > 1 ? 's' : ''}` : ''
      } ago`;
    }

    return <span className="font-light">{`${daysDiff} day${daysDiff > 1 ? 's' : ''} ago`}</span>;
  };

  const columns: TableProps<RequestSummaryInfo>['columns'] = [
    {
      title: t('browse.trackRequests.table.projectName'),
      dataIndex: 'projectName',
      key: 'projectName',
      sorter: (a: { projectName: string }, b: { projectName: string }) => a.projectName.localeCompare(b.projectName),
      sortDirections: ['ascend', 'descend'],
      render: (text: string) => <span className="font-light">{text}</span>,
    },
    {
      title: t('browse.trackRequests.table.organization'),
      dataIndex: 'projectUniversity',
      key: 'projectUniversity',
      sorter: (a: { projectUniversity: string }, b: { projectUniversity: string }) =>
        a.projectUniversity.localeCompare(b.projectUniversity),
      sortDirections: ['ascend', 'descend'],
      render: (text: string) => <span className="font-light">{text}</span>,
    },
    {
      title: t('browse.trackRequests.table.submitted'),
      dataIndex: 'createdDate',
      key: 'createdDate',
      sorter: (a: { createdDate: Date }, b: { createdDate: Date }) =>
        dayjs(a.createdDate).valueOf() - dayjs(b.createdDate).valueOf(),
      sortDirections: ['ascend', 'descend'],
      render: (value: string | Date) => renderDate(value),
    },
    {
      title: t('browse.trackRequests.table.status'),
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        const color = STATUS_COLORS[text];
        return (
          <Tag className="font-inter rounded-xl px-3 font-light" bordered color={color}>
            {STATUS_NAMES[text]}
          </Tag>
        );
      },
    },
    {
      title: t('browse.trackRequests.table.lastUpdated'),
      dataIndex: 'lastModified',
      key: 'lastModified',
      sorter: (a: { lastModified: Date }, b: { lastModified: Date }) =>
        dayjs(a.lastModified).valueOf() - dayjs(b.lastModified).valueOf(),
      sortDirections: ['ascend', 'descend'],
      render: (value: string | Date) => renderDate(value),
    },
    {
      title: '',
      key: 'manage',
      align: 'right' as const,
      width: 1,
      render: (_: unknown, row: RequestSummaryInfo) => (
        <Button ghost type="primary" onClick={() => handleRequestClick(row.requestId)}>
          {t('common.manage')}
        </Button>
      ),
    },
  ];

  const handleRequestClick = (requestId?: string) => {
    navigate(`/track-requests?id=${requestId}`);
  };

  return (
    <div className="mt-4">
      <Table<RequestSummaryInfo>
        loading={loading}
        pagination={false}
        className="base-table"
        size="small"
        columns={columns}
        dataSource={analysisRequests}
        rowKey={(record) => record.requestId}
        onRow={(_, index) => ({
          style: {
            backgroundColor: index !== undefined && index % 2 === 1 ? '#fafafa' : '#ffffff',
          },
        })}
        tableLayout="auto"
      />
    </div>
  );
};
