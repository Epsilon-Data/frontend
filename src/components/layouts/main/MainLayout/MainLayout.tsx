import React, { useEffect, useState } from 'react';
import MainContent from '../MainContent/MainContent';
import * as S from './MainLayout.styles';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import MainSider from '../sider/MainSider/MainSider';
import { Logo } from '@app/components/common/Logo/Logo';
import { findKeyByUrl } from '../sider/sidebarNavigation';

const MainLayout: React.FC = () => {
  const location = useLocation();
  const [selectedKey, setSelectedKey] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const { id } = useParams();

  useEffect(() => {
    setSelectedKey(findKeyByUrl(location.pathname));
    setIsHidden(false);
  }, [location.pathname, id]);

  return (
    <S.LayoutMaster>
      <S.Header>
        <S.HeaderLink to={'/'} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Logo />
          <span style={{ marginBottom: '0.2rem' }}>epsilon</span>
        </S.HeaderLink>
      </S.Header>
      <S.LayoutWrapper>
        <MainSider selectedNav={selectedKey} hidden={isHidden} />
        <S.LayoutMain>
          <MainContent id="main-content">
            <div>
              <Outlet />
            </div>
          </MainContent>
        </S.LayoutMain>
      </S.LayoutWrapper>
    </S.LayoutMaster>
  );
};

export default MainLayout;
