import styled from 'styled-components';
import { BaseCard as CommonCard } from '@app/components/common/BaseCard/BaseCard';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { FONT_SIZE } from '@app/styles/themes/constants';

export const CardWrapper = styled.div`
  margin-top: -1rem;
`;

export const Card = styled(CommonCard)`
  margin-bottom: 2rem;
  padding-bottom: 2rem;
`;

export const MapWrapper = styled.div`
  height: 25rem;
  width: 100%;
`;

export const HeaderButton = styled(BaseButton)`
  border: 0;
  font-size: ${FONT_SIZE.xs};
`;
