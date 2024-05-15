import React from 'react';
import { useTranslation } from 'react-i18next';
import { DatabaseRequestTable } from '@app/components/tables/DatabaseRequestTable/DatabaseRequestTable';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './ConnectionRequestsPage.styles';
import { FaCirclePlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

const ConnectionRequestsPage: React.FC = () => {
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
            <S.CreateButton type="primary" onClick={() => navigate(`create/project-info`)} icon={<FaCirclePlus />}>
              {t('connectionRequests.create.altTitle')}
            </S.CreateButton>
          }
          padding="1.25rem 1.25rem 0"
        >
          <DatabaseRequestTable />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};

export default ConnectionRequestsPage;
