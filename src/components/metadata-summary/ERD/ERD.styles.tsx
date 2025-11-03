import { styled } from 'styled-components';
import { FiMaximize } from 'react-icons/fi';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

export const ERDContainer = styled.div`
  position: relative;
  width: 100%;
  background: #fff;
  border-radius: 0.5rem;

  svg {
    max-width: 100%;
    height: auto;
    display: block;
  }
`;

export const ToolbarWrapper = styled.div`
  height: 100%;
  position: absolute;
  top: 0;
  right: 0;
  padding: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;
export const ToolbarTop = styled.div`
  flex: 0 0 auto;
  border-radius: 2px;
  background: #f2f2f2;
`;

const ToolCss = `
  padding: 4px;
  height: 30px;
  width: 30px;
  display: block;
  background: var(--lightgrey);
`;

export const ZoomInTool = styled(AiOutlinePlus)`
  ${ToolCss}
  color: gray;
  border-top-left-radius: 0.3rem;
  border-top-right-radius: 0.3rem;
`;
export const ZoomOutTool = styled(AiOutlineMinus)`
  ${ToolCss}
  color: gray;
`;
export const MaximizeTool = styled(FiMaximize)`
  ${ToolCss}
  color: gray;
  border-bottom-left-radius: 0.3rem;
  border-bottom-right-radius: 0.3rem;
`;
