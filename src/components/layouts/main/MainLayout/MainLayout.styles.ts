import styled from 'styled-components';
import { media } from '@app/styles/themes/constants';
import { BaseLayout } from '@app/components/common/BaseLayout/BaseLayout';
import { Layout, Menu } from 'antd';

export const LayoutMaster = styled(BaseLayout)`
  height: 100vh;
  width: 100vw;

  .ant-layout-has-sider {
    margin-top: 3rem;
  }
`;

export const LayoutMain = styled(BaseLayout)`
  margin-top: 1.8rem;
  @media only screen and ${media.md} {
    margin-left: 80px;
  }

  @media only screen and ${media.xl} {
    margin-left: unset;
  }
`;

export const TopNav = styled(Menu)`
  position: fixed;
  width: 100vw;
  height: 3rem;
`;

export const Header = styled(Layout)`
  width: 100vw;
  height: 3rem;
  position: fixed;
`;
