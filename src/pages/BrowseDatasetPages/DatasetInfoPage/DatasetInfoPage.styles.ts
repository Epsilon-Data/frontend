import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { Typography } from 'antd';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

export const CardWrapper = styled.div`
  margin-top: -1rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
`;

export const OrgLink = styled.a`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.regular};
  color: var(--secondary-color);
  text-decoration: underline;

  &:hover {
    text-decoration: underline;
    color: var(--primary-color);
  }
`;
export const InfoHeader = styled.div`
  display: flex;
  margin-bottom: 1rem;

  @media only screen and ${media.md} {
    margin-bottom: 0.625rem;
  }

  @media only screen and ${media.xxl} {
    margin-bottom: 1.25rem;
  }
`;

export const Title = styled.div`
  font-size: ${FONT_SIZE.lg};
  font-weight: ${FONT_WEIGHT.semibold};
  line-height: 1.375rem;

  color: var(--text-main-color);

  @media only screen and ${media.md} {
    font-size: ${FONT_SIZE.xxl};
  }
`;

export const Text = styled(Typography.Text)`
  display: flex;
  font-weight: ${FONT_WEIGHT.regular};
  font-size: ${FONT_SIZE.md};
`;

export const HorizontalDivider = styled.hr`
  height: 3px;
  margin: 3rem 0;
  background: var(--text-superLight-color);
`;

export const MapWrapper = styled.div`
  height: 25rem;
  width: 100%;
`;

export const RequestButton = styled(BaseButton)`
  background: var(--primary-color);
  border: 0;
`;
