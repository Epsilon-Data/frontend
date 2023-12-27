import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
export const ListWrapper = styled.div`
  margin-top: -1rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
`;

export const CardItem = styled(CommonCard)`
  margin-bottom: 2rem;
  border-radius: 1.5rem;
  background-color: var(--secondary-background-color);
`;
