import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation, useParams } from 'react-router-dom';
import MainSider from '../sider/MainSider/MainSider';
import { Logo } from '@app/components/common/Logo/Logo';
import { findKeyByUrl } from '../sider/sidebarNavigation';
import { Layout } from 'antd';

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
    <Layout className="h-screen w-screen">
      <Layout className="fixed top-0 left-0 z-10 flex h-14 w-full gap-2 bg-header px-8 py-1 text-2xl font-semibold text-white">
        <Link to={'/'} className="flex items-center gap-2 text-white hover:text-white">
          <Logo />
          <span style={{ marginBottom: '0.2rem' }}>epsilon</span>
        </Link>
      </Layout>
      <Layout className="overflow-hidden">
        <MainSider selectedNav={selectedKey} hidden={isHidden} />
        <Layout className="flex-1 overflow-y-auto">
          <Layout.Content id="main-content" className="overflow-auto flex flex-col justify-between">
            <div>
              <Outlet />
            </div>
          </Layout.Content>
        </Layout>
      </Layout>
    </Layout>
  );
};

export default MainLayout;
