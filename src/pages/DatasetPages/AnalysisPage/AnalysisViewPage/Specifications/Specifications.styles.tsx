import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { Typography } from 'antd/lib';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { styled } from 'styled-components';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

const { Text } = Typography;

export const InfoArea = styled.div`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  color: var(--text-main-color);

  @media only screen and ${media.xxl} {
    font-size: 1rem;
  }
`;

export const InfoTitle = styled(Text)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const InfoCard = styled(CommonCard)`
  max-width: 99%;
  background: var(--sider-bg);
  margin-bottom: 1.3rem;

  .ant-card-body {
    padding: 1rem 1.5rem;
  }

  .ant-card-head-title {
    font-size: ${FONT_SIZE.md};
    padding-top: 0;
  }
`;

export const HeaderButton = styled(BaseButton)`
  border: 0;
  font-size: ${FONT_SIZE.xs};
  background: var(--black);
`;
