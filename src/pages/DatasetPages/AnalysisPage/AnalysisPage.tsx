import React, { useCallback, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './AnalysisPage.styles';
import { AnalysisTable } from '@app/components/tables/AnalysisTable/AnalysisTable';
import { FaCirclePlus } from 'react-icons/fa6';
import { useParams } from 'react-router-dom';
import { CreateModal } from './CreateModal/CreateModal';
import { notificationController } from '@app/controllers/notificationController';
import { AnalysisTableRow, Pagination, createAnalysis, getAnalysisTableData } from '@app/api/datasets.api';
import { useMounted } from '@app/hooks/useMounted';

const initialPagination: Pagination = {
  current: 1,
  pageSize: 5,
};

const AnalysisPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isSubmitLoading, setSubmitLoading] = useState(false);
  const { isMounted } = useMounted();
  const [tableData, setTableData] = useState<{ data: AnalysisTableRow[]; pagination: Pagination; loading: boolean }>({
    data: [],
    pagination: initialPagination,
    loading: false,
  });

  const fetch = useCallback(
    (pagination: Pagination) => {
      setTableData((tableData) => ({ ...tableData, loading: true }));
      getAnalysisTableData(pagination, id).then((res) => {
        if (isMounted.current) {
          setTableData({ data: res.data, pagination: res.pagination, loading: false });
        }
      });
    },
    [id, isMounted],
  );

  const handleCreate = (name: string) => {
    setSubmitLoading(true);

    createAnalysis(id, name)
      .then(() => {
        notificationController.success({
          message: t('dataset.analysis.create.successNotify'),
        });
        fetch(initialPagination);
      })
      .catch(() => {
        notificationController.error({
          message: t('dataset.analysis.create.failNotify'),
        });
      });
    setSubmitLoading(false);
    setIsCreateModalOpen(false);
  };

  return (
    <>
      <PageTitle>{t('dataset.analysis.title')}</PageTitle>
      <S.CardWrapper>
        <S.Card
          id="analysis"
          title={t('dataset.analysis.title')}
          padding="1.25rem 1.25rem 0"
          extra={
            <S.CreateButton type="primary" icon={<FaCirclePlus />} onClick={() => setIsCreateModalOpen(true)}>
              {t('dataset.analysis.create.title')}
            </S.CreateButton>
          }
        >
          <AnalysisTable fetch={fetch} tableData={tableData} />
        </S.Card>
        <CreateModal
          isModalOpen={isCreateModalOpen}
          setIsModalOpen={setIsCreateModalOpen}
          onSubmit={handleCreate}
          loading={isSubmitLoading}
        />
      </S.CardWrapper>
    </>
  );
};

export default AnalysisPage;
