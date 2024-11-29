import React from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from '@app/components/list/SourceCardList/SourceCardList.styles';
import { SourceCardList } from '@app/components/list/SourceCardList/SourceCardList';

const SourceListPage: React.FC = () => {
  const { t } = useTranslation();
  return (
    <>
      <PageTitle>{t('databaseSources.title')}</PageTitle>
      <S.ListWrapper>
        <S.Card id="source-list" title={t('databaseSources.sourceList')} padding="1.25rem 1.25rem 0">
          <SourceCardList />
        </S.Card>
      </S.ListWrapper>
    </>
  );
};

export default SourceListPage;
