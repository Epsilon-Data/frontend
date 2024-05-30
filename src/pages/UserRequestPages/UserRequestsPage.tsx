import React from 'react';
import { useTranslation } from 'react-i18next';
import { UserRequestTable } from '@app/components/tables/UserRequestTable/UserRequestTable';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './UserRequestsPage.styles';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useParams } from 'react-router-dom';

const UserRequestsPage: React.FC = () => {
  const { page } = useParams();
  const { t } = useTranslation();
  const researcher = useAppSelector((state) => state.user.user?.roles.includes('research') || false);

  let action = '';

  if (!researcher) {
    if (page == 'receive') {
      action = 'Received ';
    } else {
      action = 'Sent ';
    }
  }

  return (
    <>
      <PageTitle>{t('connectionRequests.title')}</PageTitle>
      <S.TablesWrapper>
        <S.Card
          id="request-table"
          title={t('connectionRequests.userRequestList', { action: action })}
          padding="1.25rem 1.25rem 0"
        >
          <UserRequestTable page={page} />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};

export default UserRequestsPage;
