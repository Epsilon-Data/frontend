import React from 'react';
import * as S from './MainSider.styles';
import { SiderLogo } from '../SiderLogo';
import SiderMenu from '../SiderMenu/SiderMenu';

interface MainSiderProps {
  selectedNav: string;
}

const MainSider: React.FC<MainSiderProps> = ({ selectedNav, ...props }) => {
  return (
    <>
      <S.Sider trigger={null} width={260} {...props}>
        <SiderLogo selectedNav={selectedNav} />
        <S.HorizontalDivider />
        <S.SiderContent>
          <SiderMenu selectedNav={selectedNav} />
        </S.SiderContent>
      </S.Sider>
    </>
  );
};

export default MainSider;
