import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './AnalysisPage.styles';
import { AnalysisTable } from '@app/components/tables/AnalysisTable/AnalysisTable';
import { FaCirclePlus } from 'react-icons/fa6';

const AnalysisPage: React.FC = () => {
  //const { id } = useParams();
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('dataset.analysis.title')}</PageTitle>
      <S.CardWrapper>
        <S.Card
          id="analysis"
          title={t('dataset.analysis.title')}
          padding="1.25rem 1.25rem 0"
          extra={
            <S.CreateButton type="primary" icon={<FaCirclePlus />}>
              {t('dataset.analysis.create')}
            </S.CreateButton>
          }
        >
          <AnalysisTable />
        </S.Card>
      </S.CardWrapper>
    </>
  );
};

export default AnalysisPage;
