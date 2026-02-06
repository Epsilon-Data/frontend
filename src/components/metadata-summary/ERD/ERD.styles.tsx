import { styled } from 'styled-components';
import { FiMaximize } from 'react-icons/fi';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

export const ERDWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 500px;
  background: #fff;
  border-radius: 0.5rem;
  border: 1px solid #f0f0f0;
  overflow: hidden;
`;

export const ERDContainer = styled.div`
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafafa;
  user-select: none;
  cursor: grab;

  &:active {
    cursor: grabbing;
  }

  svg {
    display: block;
  }
`;

export const SVGWrapper = styled.div<{ scale: number; offsetX: number; offsetY: number; isDragging: boolean }>`
  transform: translate(${(props) => props.offsetX}px, ${(props) => props.offsetY}px) scale(${(props) => props.scale});
  transform-origin: center center;
  transition: ${(props) => (props.isDragging ? 'none' : 'transform 0.2s ease')};
  display: inline-block;
`;

export const ToolbarWrapper = styled.div`
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 4px;
  background: #fff;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  padding: 4px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
`;

export const ToolbarButton = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  padding: 0;
  border: none;
  background: #fff;
  color: #666;
  cursor: pointer;
  border-radius: 2px;
  transition: all 0.2s ease;
  font-size: 16px;

  &:hover {
    background: #f5f5f5;
    color: #333;
  }

  &:active {
    background: #efefef;
  }
`;

export const ZoomInIcon = styled(AiOutlinePlus)`
  font-size: 16px;
`;

export const ZoomOutIcon = styled(AiOutlineMinus)`
  font-size: 16px;
`;

export const ResetIcon = styled(FiMaximize)`
  font-size: 16px;
`;
