import React, { useEffect, useState, useRef } from 'react';
import { AnalysisTableRow, Pagination } from '@app/api/datasets.api';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { ColumnsType } from 'antd/es/table';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { useTranslation } from 'react-i18next';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { useNavigate } from 'react-router-dom';
import { Button, Input, InputRef, Space, TableColumnType } from 'antd';
import { FilterDropdownProps } from 'antd/es/table/interface';
import { SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

export const AnalysisTable: React.FC<{
  fetch: (pagination: Pagination) => void;
  tableData: { data: AnalysisTableRow[]; pagination: Pagination; loading: boolean };
}> = ({ fetch, tableData }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState<keyof AnalysisTableRow>();
  const searchInput = useRef<InputRef>(null);

  const handleSearch = (
    selectedKeys: string[],
    confirm: FilterDropdownProps['confirm'],
    dataIndex: keyof AnalysisTableRow,
  ) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters: () => void) => {
    clearFilters();
    setSearchText('');
  };

  const getColumnSearchProps = (dataIndex: keyof AnalysisTableRow): TableColumnType<AnalysisTableRow> => ({
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

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  const handleTableChange = (pagination: Pagination) => {
    fetch(pagination);
  };

  const columns: ColumnsType<AnalysisTableRow> = [
    {
      title: t('dataset.analysis.name'),
      dataIndex: 'name',
      key: 'name',
      ...getColumnSearchProps('name'),
    },
    {
      title: t('dataset.analysis.createdDate'),
      dataIndex: 'createdDate',
      key: 'createdDate',
      sorter: (a: AnalysisTableRow, b: AnalysisTableRow) =>
        new Date(a.createdDate).getTime() - new Date(b.createdDate).getTime(),
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('dataset.analysis.updatedDate'),
      dataIndex: 'updatedDate',
      key: 'updatedDate',
      sorter: (a: AnalysisTableRow, b: AnalysisTableRow) =>
        new Date(a.updatedDate).getTime() - new Date(b.updatedDate).getTime(),
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('dataset.analysis.lastUpdated'),
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      ...getColumnSearchProps('lastUpdated'),
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '15%',
      render: (text: string, record: { id: string }) => {
        return (
          <BaseSpace>
            <BaseButton type="primary" onClick={() => navigate(`/datasets/analysis/view/${record.id}`)}>
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
