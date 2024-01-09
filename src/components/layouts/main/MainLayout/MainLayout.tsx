import React, { useEffect, useState } from 'react';
import MainContent from '../MainContent/MainContent';
import * as S from './MainLayout.styles';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import { MEDICAL_DASHBOARD_PATH } from '@app/components/router/AppRouter';
import { useResponsive } from '@app/hooks/useResponsive';
import { References } from '@app/components/common/References/References';
import { Layout } from 'antd';
import { findKeyByUrl, findUrlByKey, topNavigation } from '../topNavigation';
import { useTranslation } from 'react-i18next';
import MainSider from '../sider/MainSider/MainSider';
import { updateUrlById } from '../sider/sidebarNavigation';

const MainLayout: React.FC = () => {
  const [isTwoColumnsLayout, setIsTwoColumnsLayout] = useState(true);
  const { isDesktop } = useResponsive();
  const location = useLocation();
  const { t } = useTranslation();
  const [selectedKey, setSelectedKey] = useState(findKeyByUrl(location.pathname));
  const [isHidden, setIsHidden] = useState(false);
  const { id } = useParams();
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');

  useEffect(() => {
    setIsTwoColumnsLayout([MEDICAL_DASHBOARD_PATH].includes(location.pathname) && isDesktop);
    setSelectedKey(findKeyByUrl(location.pathname));
    if (location.pathname == '/database-sources') {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }

    if (selectedKey == 'database' && id) {
      updateUrlById(id);
      setTitle(t('databaseSources.projectId', { id: id }));
    } else {
      setTitle(t('topNavigation.' + selectedKey));
    }
    setUrl(findUrlByKey(selectedKey));
  }, [location.pathname, isDesktop, selectedKey, id, t]);

  return (
    <S.LayoutMaster>
      <S.Header>
        <S.TopNav
          mode="horizontal"
          selectedKeys={[selectedKey]}
          defaultSelectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}
          items={topNavigation.map((nav) => {
            return {
              key: nav.key,
              label: <Link to={nav.url || ''}>{t(nav.label)}</Link>,
            };
          })}
        />
      </S.Header>
      <Layout>
        <MainSider title={title} titleUrl={url} selectedNav={selectedKey} hidden={isHidden} />
        <S.LayoutMain>
          <MainContent id="main-content" $isTwoColumnsLayout={isTwoColumnsLayout}>
            <div>
              <Outlet />
            </div>
            {!isTwoColumnsLayout && <References />}
          </MainContent>
        </S.LayoutMain>
      </Layout>
    </S.LayoutMaster>
  );
};

export default MainLayout;
