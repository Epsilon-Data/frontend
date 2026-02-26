import { Archetype } from '@app/api/archetypes.api';
import { STATUS_COLORS, toTitleCase } from '@app/constants/archetype';
import { Button, Table, TableProps, Tag } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
type ArchetypesProps = {
  loading: boolean;
  archetypes: Archetype[];
  projectId: string;
  archetypeReadyById?: Record<string, boolean>;
};

export const Archetypes = ({ loading, archetypes, projectId, archetypeReadyById }: ArchetypesProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const renderDate = (value: string | Date) => {
    if (!value) return <span className="font-light">—</span>;
    const date = dayjs(value);
    if (!date.isValid()) return <span className="font-light">—</span>;
    return <span className="font-light">{date.format('DD MMM YYYY, hh:mm A')}</span>;
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
      dataIndex: 'created',
      key: 'created',
      sorter: (a: { created: Date }, b: { created: Date }) =>
        dayjs(a.created).valueOf() - dayjs(b.created).valueOf(),
      sortDirections: ['ascend', 'descend'],
      render: (value: string | Date) => renderDate(value),
    },
    {
      title: '',
      key: 'manage',
      align: 'right' as const,
      width: 1,
      render: (_: unknown, row: Archetype) => {
        const isReady = !!row.id && (archetypeReadyById?.[row.id] ?? false);
        return (
          <Button
            ghost
            type="primary"
            loading={!isReady}
            disabled={!isReady}
            onClick={() => handleArchetypeClick(row.id)}
          >
            {!isReady ? t('common.loading') : t('common.manage')}
          </Button>
        );
      },
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
