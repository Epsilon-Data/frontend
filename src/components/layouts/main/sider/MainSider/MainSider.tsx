import React from 'react';
import SiderMenu from '../SiderMenu/SiderMenu';
import { Layout } from 'antd';

interface MainSiderProps {
  selectedNav: string;
  hidden: boolean;
}

const MainSider: React.FC<MainSiderProps> = ({ selectedNav, hidden }) => {
  return (
    <>
      <Layout.Sider
        trigger={null}
        width={260}
        hidden={hidden}
        className="bg-grey-1 right-0 overflow-hidden h-auto shadow-sider"
      >
        <div className="overflow-y-hidden overflow-x-hidden pb-10">
          <SiderMenu selectedNav={selectedNav} />
        </div>
      </Layout.Sider>
    </>
  );
};

export default MainSider;
