/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './DescribeDatasetPage.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { useMounted } from '@app/hooks/useMounted';
import { Pagination } from '@app/api/datasources.api';
import { FaCirclePlus } from 'react-icons/fa6';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { BaseTable } from '@app/components/common/BaseTable/BaseTable';
import { ColumnsType } from 'antd/es/table';
import { BaseSpace } from '@app/components/common/BaseSpace/BaseSpace';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { deleteTemplate, getTemplateNames } from '@app/api/templates.api';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Progress } from 'antd';

interface TemplateTableRow {
  key: number;
  id: string;
  name: string;
  progress: string;
}

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

const DescribeDatasetPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isMounted } = useMounted();
  const [projectId, setProjectId] = useState('');
  const [tableData, setTableData] = useState<{ data: TemplateTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });
  const projectDetails = useAppSelector((state: { project: { details: any } }) => state.project.details);
  const fetch = useCallback(
    (id: string | undefined) => {
      if (isMounted.current) {
        setProjectId(projectDetails?.customId);
      }

      setTableData((tableData) => ({ ...tableData, loading: true }));
      getTemplateNames(id).then((res) => {
        if (isMounted.current && res) {
          const mapped = res.map((item: { guid: string; name: string; progress: string }, index: number) => ({
            key: index,
            name: item.name,
            id: item.guid,
            progress: item.progress,
          }));
          const pagination = { ...initialPagination, total: res.length };
          setTableData({ data: mapped, pagination: pagination, loading: false });
        }
      });
      setTableData((tableData) => ({ ...tableData, loading: false }));
    },
    [projectDetails?.customId, isMounted],
  );

  const handleDelete = (templateId: string) => {
    setTableData({
      ...tableData,
      data: tableData.data.filter((item) => item.id !== templateId),
      pagination: {
        ...tableData.pagination,
        total: tableData.pagination.total ? tableData.pagination.total - 1 : tableData.pagination.total,
      },
    });
    deleteTemplate(id, templateId);
  };

  useEffect(() => {
    fetch(id);
  }, [id, fetch]);

  const columns: ColumnsType<TemplateTableRow> = [
    {
      title: t('databaseSources.describeDataset.listCols.templateName'),
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <span>{text}</span>,
    },
    {
      title: t('databaseSources.describeDataset.listCols.setupProgress'),
      dataIndex: 'progress',
      key: 'progress',
      width: '23%',
      render: (text: string) => <Progress percent={Number(text)} size={[200, 10]} />,
    },
    {
      title: t('tables.actions'),
      dataIndex: 'actions',
      width: '15%',
      render: (text: string, record: { id: string }) => (
        <BaseSpace>
          <BaseButton type="primary" danger onClick={() => handleDelete(record.id)}>
            {t('tables.delete')}
          </BaseButton>
        </BaseSpace>
      ),
    },
  ];

  return (
    <>
      <PageTitle>{t('databaseSources.describeDataset.projectTitle', { id: projectId })}</PageTitle>
      <S.CardWrapper>
        <S.Card
          id="metadata"
          title={t('databaseSources.describeDataset.projectTitle', { id: projectId })}
          padding="1.25rem 1.25rem 0"
          extra={
            <S.CreateButton type="primary" onClick={() => navigate(`create`)} icon={<FaCirclePlus />}>
              {t('databaseSources.describeDataset.createTemplate')}
            </S.CreateButton>
          }
        >
          <BaseRow gutter={[30, 30]}>
            <BaseCol span={24}>
              <BaseTable
                columns={columns}
                dataSource={tableData.data}
                pagination={tableData.pagination}
                loading={tableData.loading}
                scroll={{ x: 800 }}
              />
            </BaseCol>
          </BaseRow>
        </S.Card>
      </S.CardWrapper>
    </>
  );
};

export default DescribeDatasetPage;
