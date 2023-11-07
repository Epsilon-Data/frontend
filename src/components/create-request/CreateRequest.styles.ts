import styled from 'styled-components';
import { media } from '@app/styles/themes/constants';
import { BaseTypography } from '@app/components/common/BaseTypography/BaseTypography';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';

export const Subtitle = styled(BaseTypography.Text)`
  font-weight: 400;
  font-size: 1rem;
  display: block;
  padding-bottom: 1rem;
  padding-top: 1rem;

  @media only screen and ${media.md} {
    font-size: 1rem;
  }
`;

export const InputHeader = styled(BaseTypography.Text)`
  font-weight: 500;
  font-size: 0.9rem;
  display: block;
  padding-bottom: 0.8rem;
  color: var(--primary-color);

  @media only screen and ${media.md} {
    font-size: 0.9rem;
  }
`;

export const FormWrapper = styled.div`
  margin-top: 2rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
`;
