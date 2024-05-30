import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from '@app/components/list/DatasetCardList/DatasetCardList.styles';
import { DatasetCardList } from '@app/components/list/DatasetCardList/DatasetCardList';

const DatasetListPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('dataset.title')}</PageTitle>
      <S.ListWrapper>
        <S.Card id="dataset-list" title={t('dataset.datasetList')} padding="1.25rem 1.25rem 0">
          <DatasetCardList />
        </S.Card>
      </S.ListWrapper>
    </>
  );
};

export default DatasetListPage;
