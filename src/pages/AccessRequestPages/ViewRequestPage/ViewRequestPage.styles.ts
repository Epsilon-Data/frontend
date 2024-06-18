import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { FONT_SIZE, FONT_WEIGHT, media } from '@app/styles/themes/constants';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { Typography } from 'antd';
import { BaseForm } from '@app/components/common/forms/BaseForm/BaseForm';

const { Paragraph, Text } = Typography;

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

export const InfoArea = styled.div`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
  color: var(--text-main-color);

  @media only screen and ${media.xxl} {
    font-size: 1rem;
  }
`;

export const ActionButton = styled(BaseButton)`
  max-width: 18rem;
`;

export const RevisionCard = styled(CommonCard)`
  width: 80%;
  background: var(--revision-card-bg);
  margin: 1.3rem 0;

  .ant-card-body {
    padding: 1rem 1.5rem;
  }
`;

export const RevisionHeader = styled(Paragraph)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const RevisionContent = styled(Text)`
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.regular};
`;

export const Instructions = styled(Text)`
  font-size: ${FONT_SIZE.md};
  font-weight: ${FONT_WEIGHT.semibold};
`;

export const AddInfoButton = styled(BaseButton)`
  max-width: 18rem;
  float: right;
`;

export const AddInfoForm = styled(BaseForm)`
  margin-top: 6rem;
`;
