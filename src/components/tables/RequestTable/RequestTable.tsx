import React, { useEffect, useState, useCallback } from 'react';
import { RequestTableRow, getRequestTableData, Pagination, Tag } from '@app/api/connectionRequests.api';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { ColumnsType } from 'antd/es/table';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { defineColorByPriority } from '@app/utils/utils';
import { Status } from '@app/components/profile/profileCard/profileFormNav/nav/payments/paymentHistory/Status/Status';
import { useMounted } from '@app/hooks/useMounted';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { Priority } from '@app/constants/enums/priorities';
import { useNavigate } from 'react-router-dom';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

export const RequestTable: React.FC = () => {
  const [tableData, setTableData] = useState<{ data: RequestTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const navigate = useNavigate();
  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getRequestTableData(pagination).then((res) => {
        if (isMounted.current) {
          setTableData({ data: res.data, pagination: res.pagination, loading: false });
          setIsAdmin(res.isAdmin);
        }
      });
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  const handleTableChange = (pagination: Pagination) => {
    fetch(pagination);
  };

  const handleDeleteRow = (rowId: number) => {
    setTableData({
      ...tableData,
      data: tableData.data.filter((item) => item.key !== rowId),
      pagination: {
        ...tableData.pagination,
        total: tableData.pagination.total ? tableData.pagination.total - 1 : tableData.pagination.total,
      },
    });
  };

  const columns: ColumnsType<RequestTableRow> = [
    {
      title: t('connectionRequests.projectName'),
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text: string) => <span>{text}</span>,
    },
    ...(isAdmin
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
    ...(isAdmin
      ? [
          {
            title: t('tables.actions'),
            dataIndex: 'actions',
            width: '15%',
            render: (text: string, record: { id: string }) => {
              return (
                <BaseSpace>
                  <BaseButton type="primary" onClick={() => navigate('/connection-requests/view/' + record.id)}>
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
            render: (text: string, record: { key: number; id: string; statusTag: { priority: Priority } }) => {
              return (
                <BaseSpace>
                  <BaseButton type="primary" onClick={() => navigate('/connection-requests/view/' + record.id)}>
                    {t('tables.view')}
                  </BaseButton>
                  {record.statusTag.priority === Priority.LOW && (
                    <BaseButton type="primary" onClick={() => navigate('/database-sources/metadata/' + record.id)}>
                      {t('connectionRequests.viewSource')}
                    </BaseButton>
                  )}
                  {record.statusTag.priority === Priority.HIGH && (
                    <>
                      <BaseButton
                        type="primary"
                        onClick={() => navigate('/connection-requests/edit/' + record.id + '/project-info')}
                      >
                        {t('common.edit')}
                      </BaseButton>
                      <BaseButton type="primary" danger onClick={() => handleDeleteRow(record.key)}>
                        {t('tables.delete')}
                      </BaseButton>
                    </>
                  )}
                  {record.statusTag.priority === Priority.INFO && (
                    <BaseButton type="primary" danger onClick={() => handleDeleteRow(record.key)}>
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
