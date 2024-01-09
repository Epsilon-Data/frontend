import React from 'react';
import * as S from './MainSider.styles';
import { SiderLogo } from '../SiderLogo';
import SiderMenu from '../SiderMenu/SiderMenu';

interface MainSiderProps {
  title: string;
  titleUrl: string;
  selectedNav: string;
  hidden: boolean;
}

const MainSider: React.FC<MainSiderProps> = ({ title, titleUrl, selectedNav, hidden }) => {
  return (
    <>
      <S.Sider trigger={null} width={260} hidden={hidden}>
        <SiderLogo title={title} url={titleUrl} />
        <S.HorizontalDivider />
        <S.SiderContent>
          <SiderMenu selectedNav={selectedNav} />
        </S.SiderContent>
      </S.Sider>
    </>
  );
};

export default MainSider;
