import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from '@app/components/list/CardList/CardList.styles';
import { CardList } from '@app/components/list/CardList/CardList';

const SourceListPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('databaseSources.title')}</PageTitle>
      <S.ListWrapper>
        <S.Card id="source-list" title={t('databaseSources.sourceList')} padding="1.25rem 1.25rem 0">
          <CardList />
        </S.Card>
      </S.ListWrapper>
    </>
  );
};

export default SourceListPage;
