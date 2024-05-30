import React, { CSSProperties, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Specifications.styles';
import { Collapse, CollapseProps, Typography } from 'antd/lib';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { FaPlus } from 'react-icons/fa';
import { Pagination, ScriptInfo } from '@app/api/datasets.api';
import { ColumnsType } from 'antd/lib/table';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { FaRegCircleCheck, FaRegCircleXmark } from 'react-icons/fa6';
import { HiOutlineDotsCircleHorizontal } from 'react-icons/hi';
import { CaretRightOutlined } from '@ant-design/icons';
import { ExecutionSettings } from './ExecutionSettings/ExecutionSettings';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Specifications: React.FC<{ info: any; isLoading: boolean }> = ({ info, isLoading }) => {
  const [tableData, setTableData] = useState<{ data: ScriptInfo[]; pagination: Pagination; loading: boolean }>({
    data: info.scripts,
    pagination: initialPagination,
    loading: isLoading,
  });
  const { t } = useTranslation();
  const { Paragraph } = Typography;

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return <HiOutlineDotsCircleHorizontal style={{ color: 'var(--warning-color)' }} />;
      case 2:
        return <FaRegCircleXmark style={{ color: 'var(--error-color)' }} />;
      case 3:
        return <FaRegCircleCheck style={{ color: 'var(--success-color)' }} />;
      default:
        return null;
    }
  };

  const handleTableChange = (pagination: Pagination) => {
    setTableData((tableData) => ({ ...tableData, pagination: pagination }));
  };

  const columns: ColumnsType<ScriptInfo> = [
    {
      title: t('dataset.analysis.view.scriptName'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('dataset.analysis.view.checkValidation'),
      dataIndex: 'statusMsg',
      key: 'statusMsg',
      render: (text: string, record: { status: number }) => (
        <span>
          {getStatusIcon(record.status)} {text}
        </span>
      ),
    },
    {
      title: t('dataset.analysis.view.lastUpdated'),
      dataIndex: 'lastUpdated',
      key: 'lastUpdated',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '15%',
      render: () => {
        return (
          <BaseSpace>
            <BaseButton type="primary" danger>
              {t('tables.delete')}
            </BaseButton>
          </BaseSpace>
        );
      },
    },
  ];

  const panelStyle: React.CSSProperties = {
    marginBottom: 24,
    background: 'var(--white)',
    borderRadius: '1rem',
    border: 'none',
  };

  const getItems: (panelStyle: CSSProperties) => CollapseProps['items'] = (panelStyle) => {
    const collapseItems = [];
    for (let i = 0; i < info.scripts.length; i++) {
      collapseItems.push({
        key: i,
        label: info.scripts[i].name,
        children: <ExecutionSettings />,
        style: panelStyle,
      });
    }

    return collapseItems;
  };

  return (
    <S.InfoArea>
      <S.InfoTitle>{t('dataset.analysis.view.description')}</S.InfoTitle>
      <Paragraph style={{ margin: '1rem 0 2rem' }}>{info.description}</Paragraph>
      <S.InfoCard
        title={t('dataset.analysis.view.scripts')}
        extra={
          <S.HeaderButton type="primary" icon={<FaPlus />}>
            {t('dataset.analysis.view.addScript')}
          </S.HeaderButton>
        }
      >
        <BaseTable
          columns={columns}
          dataSource={tableData.data}
          pagination={tableData.pagination}
          loading={tableData.loading}
          onChange={handleTableChange}
          scroll={{ x: 800 }}
        />
      </S.InfoCard>
      <S.InfoCard title={t('dataset.analysis.view.executionSettings')}>
        <Collapse
          bordered={false}
          defaultActiveKey={['1']}
          expandIcon={({ isActive }) => <CaretRightOutlined rotate={isActive ? 90 : 0} rev={undefined} />}
          style={{ background: 'transparent' }}
          items={getItems(panelStyle)}
        />
      </S.InfoCard>
    </S.InfoArea>
  );
};
