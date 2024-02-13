import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './DashboardPage.styles';

const DashboardPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('dashboard.title')}</PageTitle>
      <S.CardWrapper>
        <S.Card id="dashboard" title={t('dashboard.title')} padding="1.25rem 1.25rem 0"></S.Card>
      </S.CardWrapper>
    </>
  );
};

export default DashboardPage;
