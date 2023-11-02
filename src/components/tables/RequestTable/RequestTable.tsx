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

  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getRequestTableData(pagination).then((res) => {
        if (isMounted.current) {
          setTableData({ data: res.data, pagination: res.pagination, loading: false });
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
    {
      title: t('connectionRequests.requestor'),
      dataIndex: 'requestor',
      key: 'requestor',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('connectionRequests.date'),
      dataIndex: 'requestDate',
      key: 'requestDate',
      render: (date: Date) => <span>{date.toLocaleDateString('en-GB')}</span>,
    },
    {
      title: t('tables.status'),
      dataIndex: 'requestStatus',
      key: 'requestStatus',
      render: (tag: Tag) => (
        <BaseRow gutter={[10, 10]}>
          <BaseCol key={tag.value} style={{ flex: 0.8 }}>
            <Status color={defineColorByPriority(tag.priority)} text={tag.value.toUpperCase()} />
          </BaseCol>
        </BaseRow>
      ),
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '15%',
      render: (text: string, record: { projectName: string; id: number }) => {
        return (
          <BaseSpace>
            <BaseButton
              type="ghost"
              onClick={() => {
                notificationController.info({ message: t('tables.viewMessage', { name: record.projectName }) });
              }}
            >
              {t('tables.view')}
            </BaseButton>
          </BaseSpace>
        );
      },
    },
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
