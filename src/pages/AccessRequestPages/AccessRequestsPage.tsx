import React from 'react';
import { useTranslation } from 'react-i18next';
import { AccessRequestTable } from '@app/components/tables/AccessRequestTable/AccessRequestTable';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './AccessRequestsPage.styles';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useParams } from 'react-router-dom';

const AccessRequestsPage: React.FC = () => {
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
          title={t('connectionRequests.accessRequestList', { action: action })}
          padding="1.25rem 1.25rem 0"
        >
          <AccessRequestTable page={page} />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};

export default AccessRequestsPage;
