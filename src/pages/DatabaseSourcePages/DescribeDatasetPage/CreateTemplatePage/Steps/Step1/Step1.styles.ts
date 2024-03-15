import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { Typography } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

const { Paragraph, Text } = Typography;

export const InstructionCard = styled(CommonCard)`
  width: 100%;
  background: var(--sider-bg);
  margin-bottom: 1.3rem;

  .ant-card-body {
    padding: 1rem 1.5rem;
  }
`;

export const Header = styled(Paragraph)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
  color: var(--red);
`;

export const Content = styled(Text)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const ExampleLink = styled.a`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
  color: var(--secondary-color);
  text-decoration: underline;

  &:hover {
    text-decoration: underline;
    color: var(--primary-color);
  }
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

export const InputHeader = styled(Text)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.medium};
`;
