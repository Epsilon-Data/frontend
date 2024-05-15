import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserRequestTable } from '@app/components/tables/UserRequestTable/UserRequestTable';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './UserRequestsPage.styles';

const UserRequestsPage: React.FC = () => {
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('connectionRequests.title')}</PageTitle>
      <S.TablesWrapper>
        <S.Card id="request-table" title={t('connectionRequests.userRequestList')} padding="1.25rem 1.25rem 0">
          <UserRequestTable />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};

export default UserRequestsPage;
