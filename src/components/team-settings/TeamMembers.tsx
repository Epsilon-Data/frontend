import { Button, Divider, Select, Space, Table, TableProps } from 'antd';
import dayjs from 'dayjs';
import { useTranslation } from 'react-i18next';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Member } from '@app/api/projects.api';

dayjs.extend(relativeTime);

type TeamMembersProps = {
  loading: boolean;
  teamMembers: Member[];
  projectId: string;
};

export const TeamMembers = ({ loading, teamMembers, projectId }: TeamMembersProps) => {
  const { t } = useTranslation();

  const columns: TableProps<Member>['columns'] = [
    {
      title: t('project.main.team.table.memberName'),
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Member, b: Member) => (a.name ?? '').localeCompare(b.name ?? '') || 0,
      sortDirections: ['ascend', 'descend'],
      render: (text: string) => <span className="font-light">{text}</span>,
    },
    {
      title: t('project.main.team.table.email'),
      dataIndex: 'email',
      key: 'email',
      sorter: (a: Member, b: Member) => (a.email ?? '').localeCompare(b.email ?? '') || 0,
      sortDirections: ['ascend', 'descend'],
      render: (text: string) => <span className="font-light">{text}</span>,
    },
    {
      title: t('project.main.team.table.role'),
      key: 'role',
      dataIndex: 'role',
      render: (_: unknown, row: Member) => (
        <Select
          defaultValue={row.role}
          style={{ width: 120 }}
          onChange={handleChange}
          options={[
            { value: 'Collaborator', label: 'Collaborator' },
            { value: 'Admin', label: 'Admin' },
            { value: 'REMOVE', label: 'Remove' },
          ]}
          popupRender={(menu) => (
            <>
              {menu}
              <Divider style={{ margin: '8px 0' }} />
              <Space style={{ padding: '0 8px 4px' }}>
                <Button type="text" onClick={() => removeMember(row.id)}>
                  {t('common.remove')}
                </Button>
              </Space>
            </>
          )}
        />
      ),
    },
  ];

  const handleChange = (value: string) => {
    console.log(`selected ${value} of project ${projectId}`);
  };

  const removeMember = (memberId?: string) => {
    if (!memberId) return;
  };

  return (
    <div>
      <Table<Member>
        loading={loading}
        pagination={false}
        className="base-table"
        size="small"
        columns={columns}
        dataSource={teamMembers}
        rowKey={(record) => record.id || 0}
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
