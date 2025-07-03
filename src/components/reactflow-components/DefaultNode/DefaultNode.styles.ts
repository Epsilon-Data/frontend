import { Handle } from 'reactflow';
import styled from 'styled-components';

export const DefaultNodeWrapper = styled.div`
  border-radius: 0.5rem;
  padding: 0rem 0.5rem 0.5rem 0rem;
  width: fit-content;
  height: 50px;
  padding: 0.5rem;
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
  }
`;
