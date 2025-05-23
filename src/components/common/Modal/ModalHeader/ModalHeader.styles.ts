import { FONT_FAMILY, FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import { Button } from 'antd';
import styled from 'styled-components';

export const StepWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 5rem;
`;

export const StepIndicatorWrapper = styled.div`
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 1rem;
  width: 10rem;
`;

export const StepItem = styled.div.withConfig({
  shouldForwardProp: (prop) => prop !== 'active',
})<{ active: boolean }>`
  height: 4px;
  flex: 1;
  background-color: ${({ active }) => (active ? '#1677ff' : '#ccc')};
  border-radius: 2px;
`;

export const StepBar = styled.div`
  height: 4px;
  background-color: inherit;
  border-radius: 2px;
`;

export const StepTitle = styled.div`
  font-weight: ${FONT_WEIGHT.bold};
  font-family: ${FONT_FAMILY.secondary};
  color: var(--grey1);
  text-align: left;
`;

export const DraftButton = styled(Button)`
  display: flex;
  align-items: center;
  height: 2.2rem;
  color: var(--secondary-color);
  font-size: ${FONT_SIZE.xs};
  font-weight: ${FONT_WEIGHT.medium};
  font-family: ${FONT_FAMILY.secondary};
  margin: 2rem;
`;

export const BackButton = styled(Button)`
  display: flex;
  background-color: var(--grey3);
  color: var(--secondary-color);
  border: none;
  border-radius: 0 2rem 2rem 0;
  align-items: center;
  width: 3rem;
  height: 2rem;
  top: 3rem;
`;

export const StepHeader = styled.div`
  background: var(--grey4);
  height: 6rem;
  border-radius: 0.5rem 0.5rem 0 0;
  display: flex;
  justify-content: space-between;
`;
