import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as S from './Specifications.styles';
import { Typography, Upload } from 'antd/lib';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { FaPlus } from 'react-icons/fa';
import { Pagination, ScriptInfo, deleteScript, downloadReport, uploadScript } from '@app/api/datasets.api';
import { ColumnsType } from 'antd/lib/table';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { FaRegCircleCheck, FaRegCircleXmark, FaCircleExclamation } from 'react-icons/fa6';
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
        return <FaRegCircleXmark style={{ color: 'var(--error-color)', top: '1rem', position: 'absolute' }} />;
      case 3:
        return <FaRegCircleCheck style={{ color: 'var(--success-color)', top: '1.8rem', position: 'absolute' }} />;
      case 4:
        return (
          <FaCircleExclamation style={{ color: 'var(--secondary-color)', top: '1.25rem', position: 'absolute' }} />
        );
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

  const handleDownload = (scriptId: string) => {
    downloadReport(scriptId)
      .then(() => {
        notificationController.info({ message: t('dataset.analysis.download.inProgressNotify') });
      })
      .catch(() => {
        notificationController.error({ message: t('dataset.analysis.download.failNotify') });
      });
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
      render: (text: string, record: { id: string; status: number }) => {
        return (
          <BaseSpace>
            <BaseButton type="primary" danger onClick={() => handleDeleteRow(record.id)}>
              {t('tables.delete')}
            </BaseButton>
            {(record.status == 2 || record.status == 4) && (
              <BaseButton type="primary" onClick={() => navigate('upload/' + record.id)}>
                {t('common.edit')}
              </BaseButton>
            )}
            {record.status == 3 && (
              <BaseButton type="primary" onClick={() => handleDownload(record.id)}>
                {t('dataset.analysis.download.report')}
              </BaseButton>
            )}
          </BaseSpace>
        );
      },
    },
  ];

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
    </S.InfoArea>
  );
};
