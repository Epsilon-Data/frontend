import React, { useCallback, useEffect, useState } from 'react';
import MainContent from '../MainContent/MainContent';
import * as S from './MainLayout.styles';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { DASHBOARD_PATH } from '@app/components/router/AppRouter';
import { useResponsive } from '@app/hooks/useResponsive';
import { References } from '@app/components/common/References/References';
import { findKeyByUrl, findUrlByKey, topNavigation } from '../topNavigation';
import { useTranslation } from 'react-i18next';
import MainSider from '../sider/MainSider/MainSider';
import { updateUrlById } from '../sider/sidebarNavigation';
import { getProjectId } from '@app/api/databaseSources.api';

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
  const navigate = useNavigate();
  const [projectId, setProjectId] = useState('');

  const fetch = useCallback(() => {
    if (id) {
      getProjectId(id).then((res) => {
        setProjectId(res);
      });
    }
  }, [id]);

  useEffect(() => {
    fetch();
    setIsTwoColumnsLayout([DASHBOARD_PATH].includes(location.pathname) && isDesktop);
    setSelectedKey(findKeyByUrl(location.pathname));
    if (location.pathname == '/database-sources') {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }

    if (selectedKey == 'database' && id) {
      updateUrlById(id);
      setTitle(t('databaseSources.sidebarTitle', { id: projectId }));
    } else {
      setTitle(t('topNavigation.' + selectedKey));
    }
    setUrl(findUrlByKey(selectedKey));
  }, [location.pathname, isDesktop, selectedKey, id, t, fetch, projectId]);

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
        <S.LogoutBtn onClick={() => navigate('/logout')}>{t('sidebarNavigation.logout')}</S.LogoutBtn>
      </S.Header>
      <S.LayoutWrapper>
        <MainSider title={title} titleUrl={url} selectedNav={selectedKey} hidden={isHidden} />
        <S.LayoutMain>
          <MainContent id="main-content" $isTwoColumnsLayout={isTwoColumnsLayout}>
            <div>
              <Outlet />
            </div>
            {!isTwoColumnsLayout && <References />}
          </MainContent>
        </S.LayoutMain>
      </S.LayoutWrapper>
    </S.LayoutMaster>
  );
};

export default MainLayout;
