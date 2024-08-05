import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './AnalysisPage.styles';
import { AnalysisTable } from '@app/components/tables/AnalysisTable/AnalysisTable';
import { FaCirclePlus } from 'react-icons/fa6';
import { RiDownloadCloudFill } from 'react-icons/ri';
import { useLocation, useParams } from 'react-router-dom';
import { CreateModal } from './CreateModal/CreateModal';
import { notificationController } from '@app/controllers/notificationController';
import {
  AnalysisTableRow,
  Pagination,
  createAnalysis,
  deleteAnalysis,
  downloadDataset,
  getAnalysisTableData,
} from '@app/api/datasets.api';
import { useMounted } from '@app/hooks/useMounted';
import { Flex } from 'antd';

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
  const location = useLocation();
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
          if (!location.state) {
            setTableData({ data: res.data, pagination: res.pagination, loading: false });
          } else {
            setTableData({
              data: res.data.filter((item) => item.id !== location.state.analysisId),
              pagination: {
                ...res.pagination,
                total: res.pagination.total ? res.pagination.total - 1 : res.pagination.total,
              },
              loading: false,
            });
            location.state = undefined;
          }
        }
      });
    },
    [id, isMounted, location],
  );

  useEffect(() => {
    fetch(initialPagination);
  }, [fetch]);

  useEffect(() => {
    if (location.state) {
      setTableData({
        ...tableData,
        data: tableData.data.filter((item) => item.id !== location.state.analysisId),
        pagination: {
          ...tableData.pagination,
          total: tableData.pagination.total ? tableData.pagination.total - 1 : tableData.pagination.total,
        },
      });
      location.state = undefined;
    }
  }, [location, tableData]);

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

  const handleDeleteRow = (analysisId: string) => {
    setTableData({
      ...tableData,
      data: tableData.data.filter((item) => item.id !== analysisId),
      pagination: {
        ...tableData.pagination,
        total: tableData.pagination.total ? tableData.pagination.total - 1 : tableData.pagination.total,
      },
    });
    deleteAnalysis(analysisId);
  };

  const handleDownload = () => {
    downloadDataset(id)
      .then(() => {
        notificationController.info({ message: t('dataset.analysis.download.inProgressNotify') });
      })
      .catch(() => {
        notificationController.error({ message: t('dataset.analysis.download.failNotify') });
      });
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
            <Flex gap="4px 15px" wrap="wrap">
              <S.HeaderButton type="primary" icon={<RiDownloadCloudFill size={15} />} onClick={handleDownload}>
                {t('dataset.analysis.download.dataset')}
              </S.HeaderButton>
              <S.HeaderButton
                type="primary"
                icon={<FaCirclePlus size={15} />}
                style={{ background: 'var(--black)' }}
                onClick={() => setIsCreateModalOpen(true)}
              >
                {t('dataset.analysis.create.title')}
              </S.HeaderButton>
            </Flex>
          }
        >
          {id && (
            <AnalysisTable fetch={fetch} tableData={tableData} userRequestId={id} handleDeleteRow={handleDeleteRow} />
          )}
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
