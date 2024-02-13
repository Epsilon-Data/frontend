import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

export const ViewWrapper = styled.div`
  margin-top: -1rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;

  .ant-card-actions li {
    margin-left: 1rem;
  }

  .ant-card-actions li span {
    display: flex;
    justify-content: flex-start;
  }
`;

export const InfoWrapper = styled.div`
  padding: 1.25rem;

  @media only screen and ${media.xl} {
    padding: 1rem;
  }

  @media only screen and ${media.xxl} {
    padding: 1.85rem;
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
  font-size: ${FONT_SIZE.xl};
  font-weight: ${FONT_WEIGHT.semibold};
  width: 80%;
  line-height: 1.375rem;

  color: var(--text-main-color);

  @media only screen and ${media.md} {
    font-size: ${FONT_SIZE.xxl};
  }
`;

export const InfoArea = styled.div`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  color: var(--text-main-color);

  @media only screen and ${media.xxl} {
    font-size: 1rem;
  }
`;

export const ActionButton = styled(BaseButton)`
  width: 40%;
  max-width: 18rem;
`;
