import React, { useEffect, useState, useRef } from 'react';
import mermaid from 'mermaid';
import * as S from './ERD.styles';
import { Spin } from 'antd';

const CustomToolbar: React.FC<{
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleReset: () => void;
}> = ({ handleZoomIn, handleZoomOut, handleReset }) => (
  <S.ToolbarWrapper>
    <S.ToolbarButton onClick={handleZoomIn} title="Zoom In">
      <S.ZoomInIcon />
    </S.ToolbarButton>
    <S.ToolbarButton onClick={handleZoomOut} title="Zoom Out">
      <S.ZoomOutIcon />
    </S.ToolbarButton>
    <S.ToolbarButton onClick={handleReset} title="Reset">
      <S.ResetIcon />
    </S.ToolbarButton>
  </S.ToolbarWrapper>
);

export const ERD: React.FC<{ diagramCode: string }> = ({ diagramCode }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  const [scale, setScale] = useState(0.9);
  const [offsetX, setOffsetX] = useState(0);
  const [offsetY, setOffsetY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const svgContainerRef = useRef<HTMLDivElement>(null);
  const svgWrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!diagramCode) return;

    mermaid.initialize({ startOnLoad: false, theme: 'default' });
    const svgId = `erd-${Date.now()}`;

    mermaid
      .render(svgId, diagramCode)
      .then((result) => {
        setSvgContent(result.svg);
        setScale(0.9);
        setOffsetX(0);
        setOffsetY(0);
      })
      .catch(() => {
        setSvgContent(null);
      });
  }, [diagramCode]);

  const handleZoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 3));
  };

  const handleZoomOut = () => {
    setScale((prev) => Math.max(prev - 0.5, 0.5));
  };

  const handleReset = () => {
    setScale(0.9);
    setOffsetX(0);
    setOffsetY(0);
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - offsetX, y: e.clientY - offsetY });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging) return;
    setOffsetX(e.clientX - dragStart.x);
    setOffsetY(e.clientY - dragStart.y);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  return (
    <Spin spinning={!svgContent}>
      <S.ERDWrapper>
        <CustomToolbar handleZoomIn={handleZoomIn} handleZoomOut={handleZoomOut} handleReset={handleReset} />
        <S.ERDContainer
          ref={svgContainerRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          {svgContent && (
            <S.SVGWrapper ref={svgWrapperRef} scale={scale} offsetX={offsetX} offsetY={offsetY} isDragging={isDragging}>
              <div dangerouslySetInnerHTML={{ __html: svgContent }} />
            </S.SVGWrapper>
          )}
        </S.ERDContainer>
      </S.ERDWrapper>
    </Spin>
  );
};
