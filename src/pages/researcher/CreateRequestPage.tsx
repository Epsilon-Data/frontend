import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from '../../components/create-request/CreateRequest.styles';
import { RequestProjectInfo } from '../../components/create-request/RequestProjectInfo';

const CreateRequestPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('connectionRequests.createNewRequest')}</PageTitle>
      <S.FormWrapper>
        <S.Card id="create-request" title={t('connectionRequests.createNewRequest')} padding="1.25rem 1.25rem 0">
          <RequestProjectInfo />
        </S.Card>
      </S.FormWrapper>
    </>
  );
};

export default CreateRequestPage;
