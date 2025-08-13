import { Handle } from 'reactflow';
import styled from 'styled-components';

export const DefaultNodeWrapper = styled.div`
  border-radius: 0.5rem;
  padding: 0.5rem;
  width: fit-content;
  height: 50px;
`;

export const TextDisplay = styled.div`
  margin-top: 0.25rem;
  float: right;
  font-weight: 500;
  font-size: 1rem;
  text-align: center;
  width: 200px;
  height: 36px;
  overflow-x: auto;
  overflow-y: hidden;
  white-space: nowrap;
`;

export const DefaultHandle = styled(Handle)`
  && {
    visibility: hidden;
    border: none;
    background: #4a5565;
    height: 10px;
    width: 10px;
    transition:
      height 0.3s ease,
      width 0.3s ease;
    &:hover {
      background: #1481f1;
      height: 13px;
      width: 13px;
    }
  }
`;
