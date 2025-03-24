import React, { useCallback, useEffect, useState } from 'react';
import MainContent from '../MainContent/MainContent';
import * as S from './MainLayout.styles';
import { Link, Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useResponsive } from '@app/hooks/useResponsive';
import { References } from '@app/components/common/References/References';
import { findKeyByUrl, findUrlByKey, returnUserTopNav } from '../topNavigation';
import { useTranslation } from 'react-i18next';
import MainSider from '../sider/MainSider/MainSider';
import { updateUrlById } from '../sider/sidebarNavigation';
import { BiSolidUserCircle } from 'react-icons/bi';
import { useAppDispatch, useAppSelector } from '@app/hooks/reduxHooks';
import { fetchProjectDetails } from '@app/store/slices/projectSlice';

const sidebarDisabled = ['/database-sources', '/browse', '/datasets'];

const MainLayout: React.FC = () => {
  const dispatch = useAppDispatch();
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
  const details = useAppSelector((state) => state.project.details);
  const user = useAppSelector((state) => state.user.user);
  const admin = useAppSelector((state) => state.user.user?.roles?.includes('admin') || false);
  const researcher = useAppSelector((state) => state.user.user?.roles?.includes('research') || false);

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
        if (researcher && location.pathname.includes('/requests')) {
          setIsHidden(true);
        } else {
          setIsHidden(false);
        }
      }
    }

    if (selectedKey == 'database' && id) {
      updateUrlById(id, selectedKey, admin);
      setTitle(t('databaseSources.sidebarTitle', { id: projectId }));
    } else if (selectedKey == 'dataset' && id) {
      updateUrlById(id, selectedKey, admin);
      setTitle(t('topNavigation.' + selectedKey));
    } else {
      setTitle(t('topNavigation.' + selectedKey));
    }
    setUrl(findUrlByKey(selectedKey));
  }, [location.pathname, isDesktop, selectedKey, id, t, projectId, researcher, admin]);

  const userTopNav = returnUserTopNav(researcher);
  return (
    <S.LayoutMaster>
      <S.Header>
        <S.TopNav
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
        <S.LogoutBtn onClick={() => navigate('/logout')}>{t('topNavigation.logout')}</S.LogoutBtn>
      </S.Header>
      <S.LayoutWrapper>
        <MainSider title={title} titleUrl={url} selectedNav={selectedKey} hidden={isHidden} />
        <S.LayoutMain>
          <MainContent id="main-content">
            <div>
              <Outlet />
            </div>
            <References />
          </MainContent>
        </S.LayoutMain>
      </S.LayoutWrapper>
    </S.LayoutMaster>
  );
};

export default MainLayout;
