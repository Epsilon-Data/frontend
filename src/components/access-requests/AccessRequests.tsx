import { Button, Table, TableProps, Tag } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import relativeTime from 'dayjs/plugin/relativeTime';
import { STATUS_COLORS, STATUS_NAMES } from '@app/constants/accessRequest';
import { IoIosArrowForward } from 'react-icons/io';
import { RequestSummaryInfo } from '@app/api/projects.api';

dayjs.extend(relativeTime);

type AccessRequestsProps = {
  loading: boolean;
  accessRequests: RequestSummaryInfo[];
  setOpenDrawer: (open: boolean) => void;
  fetchRequest: (record: RequestSummaryInfo, mode: string) => void;
  mode: 'CONNECTION' | 'ANALYSIS';
};

export const AccessRequests = ({ loading, accessRequests, setOpenDrawer, fetchRequest, mode }: AccessRequestsProps) => {
  const { t } = useTranslation();

  const columns: TableProps<RequestSummaryInfo>['columns'] = [
    {
      title: t('project.main.projectAccess.table.requestorName'),
      dataIndex: 'requestorName',
      key: 'requestorName',
      sorter: (a: { requestorName: string }, b: { requestorName: string }) =>
        a.requestorName.localeCompare(b.requestorName),
      sortDirections: ['ascend', 'descend'],
      render: (text: string) => <span className="font-light">{text}</span>,
    },
    {
      title: t('project.main.projectAccess.table.emailId'),
      dataIndex: 'requestorEmail',
      key: 'requestorEmail',
      sorter: (a: { requestorEmail: string }, b: { requestorEmail: string }) =>
        a.requestorEmail.localeCompare(b.requestorEmail),
      sortDirections: ['ascend', 'descend'],
      render: (text: string) => <span className="font-light">{text}</span>,
    },
    {
      title: t('project.main.projectAccess.table.orgName'),
      dataIndex: 'requestorOrgName',
      key: 'requestorOrgName',
      sorter: (a: { requestorOrgName: string }, b: { requestorOrgName: string }) =>
        a.requestorOrgName.localeCompare(b.requestorOrgName),
      sortDirections: ['ascend', 'descend'],
      render: (text: string) => <span className="font-light">{text}</span>,
    },
    {
      title: t('project.main.projectAccess.table.projectName'),
      dataIndex: 'projectName',
      key: 'projectName',
      sorter: (a: { projectName: string }, b: { projectName: string }) => a.projectName.localeCompare(b.projectName),
      sortDirections: ['ascend', 'descend'],
      render: (text: string) => <span className="font-light">{text}</span>,
    },
    {
      title: t('project.main.projectAccess.table.status'),
      dataIndex: 'status',
      key: 'status',
      width: 250,
      render: (text: string, record: RequestSummaryInfo) => {
        const color = STATUS_COLORS[text];
        return (
          <div className="flex justify-between items-center">
            <Tag className="font-inter rounded-xl px-3 font-light" color={color}>
              {STATUS_NAMES[text]}
            </Tag>
            <Button type="text" icon={<IoIosArrowForward />} onClick={() => handleRequestClick(record)} />
          </div>
        );
      },
    },
  ];

  const handleRequestClick = (record: RequestSummaryInfo) => {
    fetchRequest(record, mode);
    setOpenDrawer(true);
  };

  return (
    <div className="mt-4">
      <Table<RequestSummaryInfo>
        loading={loading}
        pagination={false}
        className="base-table"
        size="small"
        columns={columns}
        dataSource={accessRequests}
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
