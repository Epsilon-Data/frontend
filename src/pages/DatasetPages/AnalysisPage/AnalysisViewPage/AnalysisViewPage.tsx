import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './AnalysisViewPage.styles';
import { useNavigate, useParams } from 'react-router-dom';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';
import { useMounted } from '@app/hooks/useMounted';
import { AnalysisInfo, deleteAnalysis, getAnalysisDetails } from '@app/api/datasets.api';
import { INITIAL_DETAIL_VALUES } from '@app/constants/datasets';
import { MdDeleteOutline, MdOutlineModeEdit } from 'react-icons/md';
import { Flex } from 'antd';
import { Specifications } from './Specifications/Specifications';
import { notificationController } from '@app/controllers/notificationController';

const AnalysisViewPage: React.FC = () => {
  const { id, analysisId } = useParams();
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const [analysisDetails, setAnalysisDetails] = useState<AnalysisInfo>(INITIAL_DETAIL_VALUES);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const fetch = useCallback(
    (id: string | undefined) => {
      getAnalysisDetails(id).then((res) => {
        setIsLoading(true);
        if (isMounted.current && res) {
          setAnalysisDetails(res);
          setIsLoading(false);
        }
      });
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(analysisId);
  }, [analysisId, fetch]);

  const handleDelete = () => {
    deleteAnalysis(analysisId);
    notificationController.success({ message: t('dataset.analysis.view.deleteSuccess') });
    navigate(`/datasets/analysis/${id}`, { state: { analysisId } });
  };

  return (
    <>
      <PageTitle>{analysisDetails.name}</PageTitle>
      <S.CardWrapper>
        <S.Card
          id=""
          title={analysisDetails.name}
          extra={
            <Flex gap="4px 15px" wrap="wrap">
              <S.HeaderButton type="primary" icon={<MdOutlineModeEdit size={20} />}>
                {t('dataset.analysis.view.edit')}
              </S.HeaderButton>
              <S.HeaderButton type="primary" danger icon={<MdDeleteOutline size={20} />} onClick={handleDelete}>
                {t('dataset.analysis.view.delete')}
              </S.HeaderButton>
            </Flex>
          }
          padding="1.25rem 1.25rem 0"
        >
          <BaseRow style={{ display: 'flex', flexDirection: 'column' }}>
            <Specifications info={analysisDetails} isLoading={isLoading} fetch={fetch} />
          </BaseRow>
        </S.Card>
      </S.CardWrapper>
    </>
  );
};

export default AnalysisViewPage;
