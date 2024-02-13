import styled from 'styled-components';
import { Typography } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { BaseCol } from '@app/components/common/BaseCol/BaseCol';
import { LoadingOutlined } from '@ant-design/icons';

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
  text-align: center;
`;

export const Loading = styled(LoadingOutlined)`
  font-size: 200%;
`;
