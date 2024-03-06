import styled from 'styled-components';
import { Typography } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { LoadingOutlined } from '@ant-design/icons';
import { BaseRow } from '@app/components/common/BaseRow/BaseRow';

const { Paragraph } = Typography;

export const Header = styled(Paragraph)`
  font-size: ${FONT_SIZE.xxl};
  font-weight: ${FONT_WEIGHT.semibold};
  color: var(--red);
`;

export const DisplayCol = styled(BaseCol)`
  border: 2px solid var(--sider-bg);
  border-radius: 1rem;
  padding: 0.5rem;
`;

export const Loading = styled(LoadingOutlined)`
  font-size: 200%;
`;

export const ContentRow = styled(BaseRow)`
  margin: 0 3rem 2rem;
  justify-content: center;
`;

export const Message = styled(Paragraph)`
  font-size: ${FONT_SIZE.lg};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const MessageDescription = styled(Paragraph)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.regular};
  color: var(--text-main-color);
  margin-top: 1rem;
`;
