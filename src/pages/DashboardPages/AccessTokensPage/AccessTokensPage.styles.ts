import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { Typography } from 'antd';
import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';

const { Text } = Typography;

export const InstructionCard = styled(CommonCard)`
  width: 100%;
  background: var(--sider-bg);
  margin-bottom: 1.3rem;

  .ant-card-body {
    padding: 1rem 1.5rem;
  }
`;

export const CopyCard = styled(CommonCard)`
  width: 100%;
  background: var(--notification-success-color);
  margin-bottom: 1.3rem;
  border: 1px solid var(--success-color);

  .ant-card-body {
    padding: 1rem 1.5rem;
  }
`;

export const CardWrapper = styled.div`
  margin-top: -1rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
`;

export const GenerateButton = styled(BaseButton)`
  position: absolute;
  top: 1.3rem;
  right: 1.3rem;
  float: right;
  background: var(--black);
  border-color: var(--black);
  color: var(--white);
`;

export const ContentHeader = styled(Text)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.medium};
`;

export const Content = styled(Text)`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
`;

export const DeleteButton = styled(BaseButton)`
  height: 2rem;
`;
