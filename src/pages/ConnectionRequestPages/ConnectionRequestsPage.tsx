import React from 'react';
import { useTranslation } from 'react-i18next';
import { ConnectRequestTable } from '@app/components/tables/ConnectRequestTable/ConnectRequestTable';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './ConnectionRequestsPage.styles';
import { FaCirclePlus } from 'react-icons/fa6';
import { useNavigate, useParams } from 'react-router-dom';

const ConnectionRequestsPage: React.FC = () => {
  const { page } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <>
      <PageTitle>{t('connectionRequests.title')}</PageTitle>
      <S.TablesWrapper>
        <S.Card
          id="request-table"
          title={t('connectionRequests.dbRequestList')}
          extra={
            <S.CreateButton
              type="primary"
              onClick={() => navigate(`/requests/database/create/project-info`)}
              icon={<FaCirclePlus />}
            >
              {t('connectionRequests.create.altTitle')}
            </S.CreateButton>
          }
          padding="1.25rem 1.25rem 0"
        >
          <ConnectRequestTable page={page} />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};

export default ConnectionRequestsPage;
