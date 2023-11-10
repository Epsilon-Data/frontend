import React from 'react';
import { useTranslation } from 'react-i18next';
import { RequestTable } from '../../components/tables/RequestTable/RequestTable';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from '../../components/tables/Tables/Tables.styles';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const ConnectionRequestsPage: React.FC = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <>
      <PageTitle>{t('connectionRequests.title')}</PageTitle>
      <S.TablesWrapper>
        <S.Card
          id="request-table"
          title={t('connectionRequests.requestList')}
          extra={
            <BaseButton
              icon={<PlusOutlined rev={undefined} />}
              type="primary"
              style={{ background: 'var(--black)', border: 'none' }}
              onClick={() => navigate('/r-connection-requests/create/project-info')}
            >
              {t('connectionRequests.create.title')}
            </BaseButton>
          }
          padding="1.25rem 1.25rem 0"
        >
          <RequestTable user="researcher" />
        </S.Card>
      </S.TablesWrapper>
    </>
  );
};

export default ConnectionRequestsPage;
