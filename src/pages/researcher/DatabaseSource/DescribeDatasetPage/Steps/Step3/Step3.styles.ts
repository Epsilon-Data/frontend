import styled from 'styled-components';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Typography } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

const { Paragraph, Text } = Typography;

export const Header = styled(Paragraph)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
  color: var(--red);
`;

export const Content = styled(Text)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const MapWrapper = styled.div`
  height: 40rem;
  width: 100%;
`;

export const SidebarCol = styled(BaseCol)`
  background: var(--sider-bg);
  border-radius: 1rem;
  padding: 0.5rem 2rem;
`;

export const ViewportCol = styled(BaseCol)`
  border: 2px solid var(--sider-bg);
  border-radius: 1rem;
  padding: 0.5rem;
`;
