import styled from 'styled-components';
import { Handle } from 'reactflow';
import { Input } from 'antd';

export const SubcategoryNodeWrapper = styled.div`
  background: #33b1ff;
  border: 1px solid #000000;
  border-radius: 0.5rem;
  padding: 0.5rem;
  width: fit-content;
  height: 50px;
`;

export const SubcategoryDisplay = styled.div`
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

export const SubcategoryHandle = styled(Handle)`
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

export const ColumnSelectMenu = styled.div`
  position: absolute;
  top: -10%;
  left: 155%;
  transform: translateX(-50%);
  z-index: 1000;
  background: white;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  padding: 8px;
  margin-top: 4px;
  width: 100%;
`;

export const ColumnSearch = styled(Input)`
  width: 100%;
`;

export const Column = styled.div`
  margin: 0.5rem 0;
  border-radius: 0.5rem;
  border: 1px solid #90d5ff;
  width: 100%;
  .text {
    display: flex;
    border-left: 1px solid #90d5ff;
    border-right: 1px solid #90d5ff;
    margin: 0 1rem;
    padding: 0.2rem 0.5rem;
    height: 100%;
    word-break: break-all;
    justify-content: space-between;
  }

  .text span {
    display: block;
    font-size: 0.8rem;
    text-align: right;
  }
`;
