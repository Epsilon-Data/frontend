import React from 'react';
import SiderMenu from '../SiderMenu/SiderMenu';
import { Button, Layout } from 'antd';
import { useProjectOptional } from '@app/hooks/useProjectContext';
import { IoChevronBack } from 'react-icons/io5';
import { useNavigate } from 'react-router-dom';

interface MainSiderProps {
  selectedNav: string;
  hidden: boolean;
}

const MainSider: React.FC<MainSiderProps> = ({ selectedNav, hidden }) => {
  const projectContext = useProjectOptional();
  const projectName = projectContext?.project?.name;
  const navigate = useNavigate();

  return (
    <>
      <Layout.Sider
        trigger={null}
        width={260}
        hidden={hidden}
        className="bg-grey-1 right-0 overflow-hidden h-auto shadow-sider"
      >
        {projectName && (
          <>
            <div className="px-6 pt-8 flex flex-col gap-4">
              <Button
                icon={<IoChevronBack color="black" />}
                className="bg-white !rounded-full items-center"
                onClick={() => navigate('/')}
              />
              <span className="text-lg text-white">{projectName}</span>
            </div>
            <div className="border-b border-white-3 mt-3 mx-6" />
          </>
        )}
        <div className="overflow-y-hidden overflow-x-hidden pb-10">
          <SiderMenu selectedNav={selectedNav} />
        </div>
      </Layout.Sider>
    </>
  );
};

export default MainSider;
