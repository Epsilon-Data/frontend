import { FONT_SIZE, FONT_WEIGHT } from '@app/styles/themes/constants';
import styled from 'styled-components';

export const TextNodeWrapper = styled.div`
  border-radius: 0.5rem;
  padding: 0rem 0.5rem 0.5rem 0rem;
  height: 50px;
`;

export const TextNodeInput = styled.input`
  background: transparent;
  font-weight: ${FONT_WEIGHT.medium};
  font-size: ${FONT_SIZE.md};
  border: none;
  border-radius: 0.5rem;
  text-align: center;
  padding: 0.5rem;
  width: 200px;
  height: 33px;

  &:focus {
    outline: none;
    background: rgba(255, 255, 255, 0.25);
  }
`;

export const TextDisplay = styled.div`
  margin-top: 0.2rem;
  float: right;
  font-weight: ${FONT_WEIGHT.medium};
  font-size: ${FONT_SIZE.md};
  text-align: center;
  padding: 0.5rem;
  width: 200px;
  max-height: 53px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
`;
