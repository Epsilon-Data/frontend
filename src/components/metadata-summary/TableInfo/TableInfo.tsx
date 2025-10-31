import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ColumnTableRow, DatabaseTableInfo } from '@app/api/database.api';
import { ColumnsType } from 'antd/es/table';
import { Col, Row, Select, Table } from 'antd/lib';
import { DefaultOptionType } from 'antd/es/cascader';
import { IoMdLock } from 'react-icons/io';

type TableInfoProps = {
  selectItems: DefaultOptionType[];
  allTableInfo: DatabaseTableInfo[];
};

export const TableInfo = ({ selectItems, allTableInfo }: TableInfoProps) => {
  const { t } = useTranslation();
  const [hideInfo, setHideInfo] = useState(true);
  const [tableInfo, setTableInfo] = useState<DatabaseTableInfo>({} as DatabaseTableInfo);

  const handleSelectChange = (value: string) => {
    setTableInfo(allTableInfo.find((i) => i.name === value) || ({} as DatabaseTableInfo));
    setHideInfo(false);
  };

  const columns: ColumnsType<ColumnTableRow> = [
    {
      title: t('project.main.metadata.tabs.table.column'),
      dataIndex: 'name',
      render: (text: string, record: ColumnTableRow) => {
        return (
          <span className="flex font-light">
            {text} {record.primary && <IoMdLock className="text-blueDark ml-2 mt-1" />}
          </span>
        );
      },
      sorter: (a, b) => (a.primary === b.primary ? 0 : a.primary ? -1 : 1),
      defaultSortOrder: 'ascend',
      sortDirections: ['ascend', 'descend', 'ascend'],
    },
    {
      title: t('project.main.metadata.tabs.table.dataType'),
      dataIndex: 'type',
      render: (text: string) => <span className="font-light">{text}</span>,
    },
    {
      title: t('project.main.metadata.tabs.table.nullable'),
      dataIndex: 'nullable',
      render: (nullable: boolean) => <span className="font-light">{nullable ? 'Yes' : 'No'}</span>,
    },
  ];

  return (
    <>
      <div>
        <Row gutter={{ xs: 10, md: 15, xl: 30 }} className="pb-2">
          <Col span={24}>
            <Select
              className="sort-field w-1/2"
              placeholder={t('project.main.metadata.tabs.table.placeholder')}
              options={selectItems}
              onChange={handleSelectChange}
            />
          </Col>
          <Col span={24} hidden={hideInfo} className="pt-3">
            <Row gutter={[32, 16]} className="my-7">
              <Col>
                <div>{t('project.main.metadata.tabs.table.parentName')}</div>
                <div className="font-light">{tableInfo.name ?? '-'}</div>
              </Col>
              <Col>
                <div>{t('project.main.metadata.tabs.table.columnCount')}</div>
                <div className="font-light">{tableInfo.colCount ?? '-'}</div>
              </Col>
              <Col>
                <div>{t('project.main.metadata.tabs.table.tableSchema')}</div>
                <div className="font-light">{tableInfo.schema ?? '-'}</div>
              </Col>
            </Row>
            <Table
              size="small"
              className="base-table"
              columns={columns}
              dataSource={tableInfo.columns}
              pagination={false}
              style={{ width: '80%' }}
              rowKey={(row) => row.name}
            />
          </Col>
        </Row>
      </div>
    </>
  );
};
