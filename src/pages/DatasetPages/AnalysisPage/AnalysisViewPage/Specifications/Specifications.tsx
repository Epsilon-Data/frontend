import React, { CSSProperties, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Specifications.styles';
import { Collapse, CollapseProps, Typography, Upload } from 'antd/lib';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { FaPlus } from 'react-icons/fa';
import { Pagination, ScriptInfo, deleteScript, uploadScript } from '@app/api/datasets.api';
import { ColumnsType } from 'antd/lib/table';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { FaRegCircleCheck, FaRegCircleXmark, FaCircleExclamation } from 'react-icons/fa6';
import { CaretRightOutlined } from '@ant-design/icons';
import { ExecutionSettings } from './ExecutionSettings/ExecutionSettings';
import { notificationController } from '@app/controllers/notificationController';
import { useNavigate, useParams } from 'react-router-dom';
import { MdPending } from 'react-icons/md';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const Specifications: React.FC<{ info: any; isLoading: boolean; fetch: (id: string | undefined) => void }> = ({
  info,
  isLoading,
  fetch,
}) => {
  const { analysisId } = useParams();
  const [tableData, setTableData] = useState<{ data: ScriptInfo[]; pagination: Pagination; loading: boolean }>({
    data: info.scripts,
    pagination: initialPagination,
    loading: isLoading,
  });
  const { t } = useTranslation();
  const { Paragraph } = Typography;
  const navigate = useNavigate();

  useEffect(() => {
    setTableData((tableData) => ({ ...tableData, data: info.scripts, loading: isLoading }));
  }, [info.scripts, isLoading]);

  const getStatusIcon = (status: number) => {
    switch (status) {
      case 1:
        return <MdPending style={{ color: 'var(--warning-color)', top: '1.8rem', position: 'absolute' }} />;
      case 2:
        return <FaRegCircleXmark style={{ color: 'var(--error-color)', top: '1.25rem', position: 'absolute' }} />;
      case 3:
        return <FaRegCircleCheck style={{ color: 'var(--success-color)', top: '1.25rem', position: 'absolute' }} />;
      case 4:
        return <FaCircleExclamation style={{ color: 'var(--secondary-color)', top: '1.8rem', position: 'absolute' }} />;
      default:
        return null;
    }
  };

  const handleTableChange = (pagination: Pagination) => {
    setTableData((tableData) => ({ ...tableData, pagination: pagination }));
  };

  const handleDeleteRow = (scriptId: string) => {
    setTableData({
      ...tableData,
      data: tableData.data.filter((item) => item.id !== scriptId),
      pagination: {
        ...tableData.pagination,
        total: tableData.pagination.total ? tableData.pagination.total - 1 : tableData.pagination.total,
      },
    });
    deleteScript(scriptId);
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
          {getStatusIcon(record.status)}
          <span style={{ marginLeft: '1.2rem' }}>{text}</span>
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
      render: (text: string, record: { id: string }) => {
        return (
          <BaseSpace>
            <BaseButton type="primary" danger onClick={() => handleDeleteRow(record.id)}>
              {t('tables.delete')}
            </BaseButton>
            <BaseButton type="primary" onClick={() => navigate('upload/' + record.id)}>
              {t('common.edit')}
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
    for (let i = 0; i < tableData.data.length; i++) {
      collapseItems.push({
        key: i,
        label: tableData.data[i].name,
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
          <Upload
            showUploadList={false}
            maxCount={1}
            customRequest={({ file, onSuccess }) => {
              if (onSuccess) {
                uploadScript(analysisId, file)
                  .then((response) => {
                    onSuccess(response);
                    fetch(analysisId);
                    navigate('upload/' + response);
                  })
                  .catch(() => {
                    notificationController.error({ message: t('dataset.analysis.view.scriptAddFail') });
                  });
              }
            }}
          >
            <S.HeaderButton type="primary" icon={<FaPlus />}>
              {t('dataset.analysis.view.addScript')}
            </S.HeaderButton>
          </Upload>
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
