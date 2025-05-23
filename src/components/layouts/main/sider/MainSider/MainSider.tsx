import React from 'react';
import * as S from './MainSider.styles';
import SiderMenu from '../SiderMenu/SiderMenu';

interface MainSiderProps {
  selectedNav: string;
  hidden: boolean;
}

const MainSider: React.FC<MainSiderProps> = ({ selectedNav, hidden }) => {
  return (
    <>
      <S.Sider trigger={null} width={260} hidden={hidden} style={{ background: 'var(--grey1)' }}>
        <S.SiderContent>
          <SiderMenu selectedNav={selectedNav} />
        </S.SiderContent>
      </S.Sider>
    </>
  );
};

export default MainSider;
