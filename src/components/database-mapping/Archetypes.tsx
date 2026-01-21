import { Archetype } from '@app/api/archetypes.api';
import { STATUS_COLORS, toTitleCase } from '@app/constants/archetype';
import { Button, Table, TableProps, Tag } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

type ArchetypesProps = {
  loading: boolean;
  archetypes: Archetype[];
  projectId: string;
};

export const Archetypes = ({ loading, archetypes, projectId }: ArchetypesProps) => {
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

  const columns: TableProps<Archetype>['columns'] = [
    {
      title: t('project.main.dbMapping.table.name'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a: { name: string }, b: { name: string }) => a.name.localeCompare(b.name),
      sortDirections: ['ascend', 'descend'],
      render: (text: string) => <span className="font-light">{text}</span>,
    },
    {
      title: t('project.main.dbMapping.table.status'),
      dataIndex: 'status',
      key: 'status',
      render: (text: string) => {
        const color = STATUS_COLORS[text];
        return (
          <Tag className="font-inter rounded-2xl px-3 font-light" color={color}>
            {toTitleCase(text)}
          </Tag>
        );
      },
    },
    {
      title: t('project.main.dbMapping.table.createdBy'),
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: (text: string) => <span className="font-light">{text}</span>,
    },
    {
      title: t('project.main.dbMapping.table.lastModified'),
      dataIndex: 'lastModified',
      key: 'lastModified',
      sorter: (a: { lastModified: Date }, b: { lastModified: Date }) =>
        dayjs(a.lastModified).valueOf() - dayjs(b.lastModified).valueOf(),
      sortDirections: ['ascend', 'descend'],
      render: (value: string | Date) => renderDate(value),
    },
    {
      title: t('project.main.dbMapping.table.createdDate'),
      dataIndex: 'createdDate',
      key: 'createdDate',
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
      render: (_: unknown, row: Archetype) => (
        <Button ghost type="primary" disabled={!row.id} onClick={() => handleArchetypeClick(row.id)}>
          {t('common.manage')}
        </Button>
      ),
    },
  ];

  const handleArchetypeClick = (archetypeId?: string) => {
    if (!archetypeId) return;
    navigate(`/project/db-mapping?id=${projectId}&archetypeId=${archetypeId}`);
  };

  return (
    <div className="mt-10">
      <Table<Archetype>
        loading={loading}
        pagination={false}
        className="base-table"
        size="small"
        columns={columns}
        dataSource={archetypes}
        rowKey={(record) => record.id}
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
