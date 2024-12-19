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

  .react-flow {
    .react-flow__nodes {
      .react-flow__node.selected {
        .column-node {
          border: 1px solid var(--secondary-color);

          div {
            border-left: 1px solid var(--secondary-color);
            border-right: 1px solid var(--secondary-color);
          }
        }
        .react-flow__handle {
          visibility: visible;
        }
      }
      .react-flow__node:hover {
        .react-flow__handle {
          visibility: visible;
        }
      }
    }
  }
`;

export const SidebarCol = styled(BaseCol)`
  background: var(--sider-bg);
  border-radius: 1rem;
  padding: 0.5rem 0 0;
`;

export const ViewportCol = styled(BaseCol)`
  border: 2px solid var(--sider-bg);
  border-radius: 1rem;
  padding: 0.5rem;
  height: fit-content;
`;
