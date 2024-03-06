import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PageTitle } from '@app/components/common/PageTitle/PageTitle';
import * as S from './AccessPermissionsPage.styles';
import { useParams } from 'react-router-dom';
import { useMounted } from '@app/hooks/useMounted';
import { getProjectId } from '@app/api/databaseSources.api';

const AccessPermissionsPage: React.FC = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const { isMounted } = useMounted();
  const [projectId, setProjectId] = useState('');
  const [activeTabKey, setActiveTabKey] = useState('research');

  const fetch = useCallback(
    (id: string | undefined) => {
      getProjectId(id).then((res) => {
        if (isMounted.current) {
          setProjectId(res);
        }
      });
    },
    [isMounted],
  );

  useEffect(() => {
    fetch(id);
  }, [fetch, id]);

  const tabList = [
    {
      key: 'research',
      label: t('databaseSources.accessPermissions.research'),
    },
    {
      key: 'govOrg',
      label: t('databaseSources.accessPermissions.govOrg'),
    },
    {
      key: 'others',
      label: t('databaseSources.accessPermissions.others'),
    },
  ];

  const handleTabChange = (key: string) => {
    setActiveTabKey(key);
  };

  return (
    <>
      <PageTitle>{t('databaseSources.accessPermissions.projectTitle', { id: projectId })}</PageTitle>
      <S.CardWrapper>
        <S.Card
          id="access-permissions"
          title={t('databaseSources.accessPermissions.projectTitle', { id: projectId })}
          padding="1.25rem 1.25rem 0"
          tabList={tabList}
          activeTabKey={activeTabKey}
          onTabChange={handleTabChange}
          tabProps={{ size: 'middle' }}
        ></S.Card>
      </S.CardWrapper>
    </>
  );
};

export default AccessPermissionsPage;
