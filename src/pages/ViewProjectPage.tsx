import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';

const ViewProjectPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('connectionRequests.id') + ' '}</PageTitle>
    </>
  );
};

export default ViewProjectPage;
