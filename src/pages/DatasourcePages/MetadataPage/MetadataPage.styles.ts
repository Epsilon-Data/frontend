import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

export const CardWrapper = styled.div`
  margin-top: -1rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
`;

export const Button = styled(BaseButton)`
  width: 100%;
  background: var(--aquamarine);
  border-color: var(--aquamarine);
  color: var(--black);

  &:focus {
    background: var(--aquamarine);
    border-color: var(--aquamarine);
    color: var(--black);
  }
`;
