import React, { useCallback, useEffect, useState } from 'react';
import MainContent from '../MainContent/MainContent';
import * as S from './MainLayout.styles';
import { Outlet, useLocation, useParams } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';
import { findKeyByUrl, findUrlByKey } from '../topNavigation';
import { useTranslation } from 'react-i18next';
import MainSider from '../sider/MainSider/MainSider';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { fetchProjectDetails } from '@app/store/slices/projectSlice';
import { Logo } from '@app/components/common/Logo/Logo';

const sidebarDisabled = ['/database-sources', '/browse', '/datasets'];

const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();
  const { isDesktop } = useResponsive();
  const location = useLocation();
  const { t } = useTranslation();
  const [selectedKey, setSelectedKey] = useState(findKeyByUrl(location.pathname));
  const [isHidden, setIsHidden] = useState(false);
  const { id } = useParams();
  // const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  // const navigate = useNavigate();
  const [projectId, setProjectId] = useState('');
  const details = useAppSelector((state) => state.project.details);
  // const user = useAppSelector((state) => state.user.user);

  const fetch = useCallback(() => {
    if (id && location.pathname.includes('/database-sources')) {
      dispatch(fetchProjectDetails(id));
    }
  }, [dispatch, location.pathname, id]);

  useEffect(() => {
    fetch();
    if (details?.customId) {
      setProjectId(details?.customId);
    }
  }, [details?.customId, fetch, id]);

  useEffect(() => {
    setSelectedKey(findKeyByUrl(location.pathname));
    if (sidebarDisabled.includes(location.pathname)) {
      setIsHidden(true);
    } else {
      if (location.pathname.includes('/browse/')) {
        setIsHidden(true);
      } else {
        if (location.pathname.includes('/requests')) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
      }
    }

    setUrl(findUrlByKey(selectedKey));
  }, [location.pathname, isDesktop, selectedKey, id, t, projectId]);

  // const userTopNav = returnUserTopNav(researcher);
  return (
    <S.LayoutMaster>
      <S.Header>
        <S.HeaderLink to={url} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Logo />
          <span style={{ marginBottom: '0.2rem' }}>epsilon</span>
        </S.HeaderLink>
        {/* <S.TopNav
          mode="horizontal"
          selectedKeys={[selectedKey]}
          defaultSelectedKeys={[selectedKey]}
          onClick={({ key }) => setSelectedKey(key)}
          items={userTopNav.map((nav) => {
            return {
              key: nav.key,
              label: <Link to={nav.url || ''}>{t(nav.label)}</Link>,
            };
          })}
        />
        <S.Username to={'/'}>
          <BiSolidUserCircle size={23} style={{ marginRight: '0.6rem', top: '0.35rem', position: 'relative' }} />
          {user?.userName}
        </S.Username>
        <S.LogoutBtn onClick={() => navigate('/logout')}>{t('topNavigation.logout')}</S.LogoutBtn> */}
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
