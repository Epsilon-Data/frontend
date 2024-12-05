import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './DatabaseSummaryPage.styles';
import { OverallDescription } from '@app/components/database-summary/OverallDescription/OverallDescription';
import { getDbSummary } from '@app/api/datasources.api';
import { useParams } from 'react-router-dom';
import { OverallDatabaseInfoValues } from '@app/interfaces/interfaces';
import { useMounted } from '@app/hooks/useMounted';
import { INITIAL_OVERALL_DB_INFO } from '@app/constants/datasource';
import { ERD } from '@app/components/database-summary/ERD/ERD';

const DatabaseSummaryPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const [activeTabKey, setActiveTabKey] = useState('overall');
  const [info, setInfo] = useState<OverallDatabaseInfoValues>(INITIAL_OVERALL_DB_INFO);
  const [diagramCode, setDiagramCode] = useState('');

  const fetch = useCallback(
    (id: string | undefined) => {
      getDbSummary(id).then((res) => {
        if (isMounted.current) {
          setInfo(res.overall);
          setDiagramCode(res.diagram);
        }
      });
    },
    [setInfo, isMounted],
  );

  useEffect(() => {
    fetch(id);
  }, [fetch, id]);

  const tabList = [
    {
      key: 'overall',
      label: t('databaseSources.metadata.overallDesc.title'),
      children: <OverallDescription info={info} />,
    },
    {
      key: 'erd',
      label: t('databaseSources.metadata.erd'),
      children: <ERD diagramCode={diagramCode} />,
    },
  ];

  return (
    <>
      <PageTitle>{t('databaseSources.metadata.dbSummary')}</PageTitle>
      <S.CardWrapper>
        <S.Card
          id="metadata"
          title={t('databaseSources.metadata.dbSummary')}
          padding="1.25rem 1.25rem 0"
          tabList={tabList}
          activeTabKey={activeTabKey}
          onTabChange={(key) => setActiveTabKey(key)}
          tabProps={{ tabPosition: 'left', size: 'middle' }}
        ></S.Card>
      </S.CardWrapper>
    </>
  );
};

export default DatabaseSummaryPage;
