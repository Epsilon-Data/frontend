import React from 'react';
import * as S from './MainSider/MainSider.styles';
import { RightOutlined } from '@ant-design/icons';
import { useResponsive } from 'hooks/useResponsive';
import { useTranslation } from 'react-i18next';

interface SiderLogoProps {
  isSiderCollapsed: boolean;
  toggleSider: () => void;
  selectedNav: string;
}
export const SiderLogo: React.FC<SiderLogoProps> = ({ isSiderCollapsed, toggleSider, selectedNav }) => {
  const { tabletOnly } = useResponsive();
  const { t } = useTranslation();
  const title = 'topNavigation.' + selectedNav;

  return (
    <S.SiderLogoDiv>
      <S.TabSpan>{t(title)}</S.TabSpan>
      {tabletOnly && (
        <S.CollapseButton
          size="small"
          $isCollapsed={isSiderCollapsed}
          icon={<RightOutlined rotate={isSiderCollapsed ? 0 : 180} rev={undefined} />}
          onClick={toggleSider}
        />
      )}
    </S.SiderLogoDiv>
  );
};
