import React, { useEffect, useState, useCallback, useRef } from 'react';
import { RequestTableRow, getRequestTableData, Pagination, Tag, deleteRequest } from '@app/api/accessRequests.api';
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
import { useNavigate } from 'react-router-dom';
import { Button, Input, InputRef, Space, TableColumnType } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Priority } from '@app/constants/enums/priorities';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

export const AccessRequestTable: React.FC<{ page: string | undefined }> = ({ page }) => {
  const [tableData, setTableData] = useState<{ data: RequestTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const navigate = useNavigate();
  const researcher = useAppSelector((state) => state.user.user?.roles.includes('research') || false);

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState<keyof RequestTableRow>();
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: keyof RequestTableRow,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: keyof RequestTableRow): TableColumnType<RequestTableRow> => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, close }) => (
      <div style={{ padding: 8 }} onKeyDown={(e) => e.stopPropagation()}>
        <Input
          ref={searchInput}
          placeholder={'Search column'}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
          style={{ marginBottom: 8, display: 'block' }}
        />
        <Space>
          <Button
            type="primary"
            onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
            icon={<SearchOutlined rev={undefined} />}
            size="small"
            style={{ width: 90 }}
          >
            Search
          </Button>
          <Button onClick={() => clearFilters && handleReset(clearFilters)} size="small" style={{ width: 90 }}>
            Reset
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              confirm({ closeDropdown: false });
              setSearchText((selectedKeys as string[])[0]);
              setSearchedColumn(dataIndex);
            }}
          >
            Filter
          </Button>
          <Button
            type="link"
            size="small"
            onClick={() => {
              close();
            }}
          >
            Close
          </Button>
        </Space>
      </div>
    ),
    filterIcon: (filtered: boolean) => (
      <SearchOutlined style={{ color: filtered ? '#1677ff' : undefined }} rev={undefined} />
    ),
    onFilter: (value, record) =>
      record[dataIndex]
        .toString()
        .toLowerCase()
        .includes((value as string).toLowerCase()),
    onFilterDropdownOpenChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current?.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getRequestTableData(pagination, page).then((res) => {
        if (isMounted.current) {
          setTableData({ data: res.data, pagination: res.pagination, loading: false });
        }
      });
    },
    [isMounted, page],
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
    ...(researcher || page == 'sent'
      ? []
      : [
          {
            title: t('connectionRequests.requestor'),
            dataIndex: 'requestor',
            key: 'requestor',
            ...getColumnSearchProps('requestor'),
          },
        ]),
    {
      title: t('connectionRequests.requestingProject'),
      dataIndex: 'requestingProject',
      key: 'requestingProject',
      ...getColumnSearchProps('requestingProject'),
    },
    {
      title: t('connectionRequests.requestorProject'),
      dataIndex: 'projectName',
      key: 'projectName',
      ...getColumnSearchProps('projectName'),
    },
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
    ...(researcher || page == 'sent'
      ? [
          {
            title: t('tables.actions'),
            dataIndex: 'actions',
            width: '15%',
            render: (text: string, record: { id: string; statusTag: { priority: Priority } }) => {
              return (
                <BaseSpace>
                  <BaseButton type="primary" onClick={() => navigate(`/requests/user/view/${record.id}`)}>
                    {t('tables.view')}
                  </BaseButton>
                  {record.statusTag.priority == Priority.LOW && (
                    <BaseButton type="primary" onClick={() => navigate(`/datasets/analysis/${record.id}`)}>
                      {t('connectionRequests.viewDataset')}
                    </BaseButton>
                  )}
                  {record.statusTag.priority == Priority.HIGH && (
                    <>
                      <BaseButton type="primary" onClick={() => navigate(`/requests/user/edit/${record.id}/dataset`)}>
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
        ]
      : [
          {
            title: t('tables.actions'),
            dataIndex: 'actions',
            width: '15%',
            render: (text: string, record: { id: string }) => {
              return (
                <BaseSpace>
                  <BaseButton type="primary" onClick={() => navigate(`/requests/user/view/${record.id}`)}>
                    {t('tables.view')}
                  </BaseButton>
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
