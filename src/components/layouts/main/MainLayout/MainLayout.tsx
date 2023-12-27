import React, { useEffect, useState } from 'react';
import MainContent from '../MainContent/MainContent';
import * as S from './MainLayout.styles';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { MEDICAL_DASHBOARD_PATH, NFT_DASHBOARD_PATH } from '@app/components/router/AppRouter';
import { useResponsive } from '@app/hooks/useResponsive';
import { References } from '@app/components/common/References/References';
import { Layout } from 'antd';
import { topNavigation } from '../topNavigation';
import { useTranslation } from 'react-i18next';
import MainSider from '../sider/MainSider/MainSider';

const MainLayout: React.FC = () => {
  const [isTwoColumnsLayout, setIsTwoColumnsLayout] = useState(true);
  const { isDesktop } = useResponsive();
  const location = useLocation();
  const { t } = useTranslation();
  const [selectedKey, setSelectedKey] = useState('home');

  useEffect(() => {
    setIsTwoColumnsLayout([MEDICAL_DASHBOARD_PATH, NFT_DASHBOARD_PATH].includes(location.pathname) && isDesktop);
  }, [location.pathname, isDesktop]);

  return (
    <S.LayoutMaster>
      <S.Header>
        <S.TopNav
          mode="horizontal"
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
        <MainSider selectedNav={selectedKey} />
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
