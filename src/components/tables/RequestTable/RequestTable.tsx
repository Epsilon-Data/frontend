import React, { useEffect, useState, useCallback } from 'react';
import { RequestTableRow, getRequestTableData, Pagination, Tag } from 'api/connectionRequests.api';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { ColumnsType } from 'antd/es/table';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { defineColorByPriority } from '@app/utils/utils';
import { notificationController } from 'controllers/notificationController';
import { Status } from '@app/components/profile/profileCard/profileFormNav/nav/payments/paymentHistory/Status/Status';
import { useMounted } from '@app/hooks/useMounted';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { Priority } from '@app/constants/enums/priorities';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useNavigate } from 'react-router-dom';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

export const RequestTable: React.FC<{ userType: string }> = ({ userType }) => {
  const [tableData, setTableData] = useState<{ data: RequestTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const user = useAppSelector((state) => state.user.user);
  const navigate = useNavigate();

  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getRequestTableData(pagination, userType, user?.id).then((res) => {
        if (isMounted.current) {
          setTableData({ data: res.data, pagination: res.pagination, loading: false });
        }
      });
    },
    [isMounted, user?.id, userType],
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
      data: tableData.data.filter((item) => item.id !== rowId),
      pagination: {
        ...tableData.pagination,
        total: tableData.pagination.total ? tableData.pagination.total - 1 : tableData.pagination.total,
      },
    });
  };

  const columns: ColumnsType<RequestTableRow> = [
    {
      title: t('connectionRequests.id'),
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: t('connectionRequests.projectName'),
      dataIndex: 'projectName',
      key: 'projectName',
      render: (text: string) => <span>{text}</span>,
    },
    ...(userType === 'orgAdmin'
      ? [
          {
            title: t('connectionRequests.requestor'),
            dataIndex: 'requestor',
            key: 'requestor',
            render: (text: string) => <span>{text}</span>,
          },
        ]
      : userType === 'researcher'
      ? []
      : []),
    {
      title: t('connectionRequests.date'),
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('tables.status'),
      dataIndex: 'requestStatus',
      key: 'requestStatus',
      render: (tag: Tag) => (
        <BaseRow gutter={[10, 10]}>
          <BaseCol key={tag.value}>
            <Status color={defineColorByPriority(tag.priority)} text={tag.value.toUpperCase()} />
          </BaseCol>
        </BaseRow>
      ),
    },
    ...(userType === 'orgAdmin'
      ? [
          {
            title: t('tables.actions'),
            dataIndex: 'actions',
            width: '15%',
            render: (text: string, record: { projectName: string; id: number }) => {
              return (
                <BaseSpace>
                  <BaseButton type="primary" onClick={() => navigate('/r-connection-requests/view/' + record.id)}>
                    {t('tables.view')}
                  </BaseButton>
                </BaseSpace>
              );
            },
          },
        ]
      : userType === 'researcher'
      ? [
          {
            title: t('tables.actions'),
            dataIndex: 'actions',
            width: '15%',
            render: (
              text: string,
              record: { projectName: string; id: number; requestStatus: { priority: Priority } },
            ) => {
              const { priority } = record.requestStatus;
              return (
                <BaseSpace>
                  <BaseButton type="primary" onClick={() => navigate('/r-connection-requests/view/' + record.id)}>
                    {t('tables.view')}
                  </BaseButton>
                  {priority === Priority.LOW && (
                    <BaseButton
                      type="primary"
                      onClick={() => {
                        notificationController.info({ message: t('tables.viewMessage', { name: record.projectName }) });
                      }}
                    >
                      {t('connectionRequests.viewSource')}
                    </BaseButton>
                  )}
                  {priority === Priority.HIGH && (
                    <>
                      <BaseButton type="primary" onClick={() => navigate('/r-connection-requests/view/' + record.id)}>
                        {t('common.edit')}
                      </BaseButton>
                      <BaseButton type="primary" danger onClick={() => handleDeleteRow(record.id)}>
                        {t('tables.delete')}
                      </BaseButton>
                    </>
                  )}
                  {priority === Priority.INFO && (
                    <BaseButton type="primary" danger onClick={() => handleDeleteRow(record.id)}>
                      {t('tables.delete')}
                    </BaseButton>
                  )}
                </BaseSpace>
              );
            },
          },
        ]
      : []),
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
