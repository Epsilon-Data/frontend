import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';

export const TablesWrapper = styled.div`
  margin-top: -1rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
`;

export const CreateButton = styled(BaseButton)`
  position: absolute;
  top: 1.3rem;
  right: 1.3rem;
  float: right;
  background: var(--black);
  border-color: var(--black);
  color: var(--white);
`;
