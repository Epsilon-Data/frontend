import React from 'react';
import { useTranslation } from 'react-i18next';
import { RequestTable } from '../components/tables/RequestTable/RequestTable';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from '../components/tables/Tables/Tables.styles';

const ConnectionRequestsPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('connectionRequests.title')}</PageTitle>
      <S.TablesWrapper>
        <S.Card id="basic-table" title={t('connectionRequests.requestList')} padding="1.25rem 1.25rem 0">
          <RequestTable />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};

export default ConnectionRequestsPage;
