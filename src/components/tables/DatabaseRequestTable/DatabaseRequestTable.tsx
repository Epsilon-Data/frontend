import React, { useEffect, useState, useCallback } from 'react';
import { RequestTableRow, getRequestTableData, Pagination, Tag, deleteRequest } from '@app/api/connectionRequests.api';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { ColumnsType } from 'antd/es/table';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { defineColorByPriority } from '@app/utils/utils';
import { Status } from '@app/components/status/Status';
import { useMounted } from '@app/hooks/useMounted';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { Priority } from '@app/constants/enums/priorities';
import { useNavigate } from 'react-router-dom';
import { SourceStatus } from '@app/constants/enums/sourceStatus';
import { useAppSelector } from '@app/hooks/reduxHooks';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

export const DatabaseRequestTable: React.FC = () => {
  const [tableData, setTableData] = useState<{ data: RequestTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const navigate = useNavigate();
  const admin = useAppSelector((state) => state.user.user?.roles.includes('admin') || false);
  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getRequestTableData(pagination, admin).then((res) => {
        if (isMounted.current) {
          setTableData({ data: res.data, pagination: res.pagination, loading: false });
        }
      });
    },
    [admin, isMounted],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  const handleTableChange = (pagination: Pagination) => {
    fetch(pagination);
  };

  const handleDeleteRow = (requestId: string) => {
    setTableData({
      ...tableData,
      data: tableData.data.filter((item) => item.id !== requestId),
      pagination: {
        ...tableData.pagination,
        total: tableData.pagination.total ? tableData.pagination.total - 1 : tableData.pagination.total,
      },
    });
    deleteRequest(requestId);
  };

  const columns: ColumnsType<RequestTableRow> = [
    {
      title: t('connectionRequests.details.projectInfo.id'),
      dataIndex: 'projectCustomId',
      key: 'projectCustomId',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('connectionRequests.details.projectInfo.name'),
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text: string) => <span>{text}</span>,
    },
    ...(admin
      ? [
          {
            title: t('connectionRequests.requestor'),
            dataIndex: 'requestor',
            key: 'requestor',
            render: (text: string) => <span>{text}</span>,
          },
        ]
      : []),
    {
      title: t('connectionRequests.date'),
      dataIndex: 'createdDate',
      key: 'createdDate',
      sorter: (a: RequestTableRow, b: RequestTableRow) =>
        new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('tables.status'),
      dataIndex: 'statusTag',
      key: 'statusTag',
      render: (tag: Tag) => (
        <BaseRow gutter={[10, 10]}>
          <BaseCol key={tag.value}>
            <Status color={defineColorByPriority(tag.priority)} text={tag.value.toUpperCase()} />
          </BaseCol>
        </BaseRow>
      ),
    },
    ...(admin
      ? [
          {
            title: t('tables.actions'),
            dataIndex: 'actions',
            width: '15%',
            render: (text: string, record: { id: string }) => {
              return (
                <BaseSpace>
                  <BaseButton type="primary" onClick={() => navigate(`/requests/database/view/${record.id}`)}>
                    {t('tables.view')}
                  </BaseButton>
                </BaseSpace>
              );
            },
          },
        ]
      : [
          {
            title: t('tables.actions'),
            dataIndex: 'actions',
            width: '15%',
            render: (
              text: string,
              record: { id: string; projectId?: string; dbStatus?: number; statusTag: { priority: Priority } },
            ) => {
              return (
                <BaseSpace>
                  <BaseButton type="primary" onClick={() => navigate(`/requests/database/view/${record.id}`)}>
                    {t('tables.view')}
                  </BaseButton>
                  {record.statusTag.priority == Priority.LOW && (
                    <BaseButton
                      type="primary"
                      onClick={() => {
                        if (record.dbStatus == SourceStatus.ACTIVE) {
                          navigate('/database-sources/metadata/' + record.projectId);
                        } else {
                          navigate('/database-sources');
                        }
                      }}
                    >
                      {t('connectionRequests.viewSource')}
                    </BaseButton>
                  )}
                  {record.statusTag.priority == Priority.HIGH && (
                    <>
                      <BaseButton
                        type="primary"
                        onClick={() => navigate(`/requests/database/edit/${record.id}/project-info`)}
                      >
                        {t('common.edit')}
                      </BaseButton>
                    </>
                  )}
                  {(record.statusTag.priority == Priority.INFO || record.statusTag.priority == Priority.HIGH) && (
                    <BaseButton type="primary" danger onClick={() => handleDeleteRow(record.id)}>
                      {t('tables.delete')}
                    </BaseButton>
                  )}
                </BaseSpace>
              );
            },
          },
        ]),
  ];

  return (
    <BaseTable
      columns={columns}
      dataSource={tableData.data}
      pagination={tableData.pagination}
      loading={tableData.loading}
      onChange={handleTableChange}
      scroll={{ x: 800 }}
    />
  );
};
