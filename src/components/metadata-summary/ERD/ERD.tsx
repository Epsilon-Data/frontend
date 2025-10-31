import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import * as S from './ERD.styles';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';
import { Spin } from 'antd';

const CustomToolbar: React.FC<{
  className: string;
  handleZoomIn: () => void;
  handleZoomOut: () => void;
  handleReset: () => void;
}> = ({ className, handleZoomIn, handleZoomOut, handleReset }) => (
  <S.ToolbarWrapper className={className}>
    <S.ToolbarTop>
      <S.ZoomInTool onClick={handleZoomIn} />
      <S.ZoomOutTool onClick={handleZoomOut} />
      <S.MaximizeTool onClick={handleReset} />
    </S.ToolbarTop>
  </S.ToolbarWrapper>
);

export const ERD: React.FC<{ diagramCode: string }> = ({ diagramCode }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);

  useEffect(() => {
    if (!diagramCode) return;

    mermaid.initialize({ startOnLoad: false });
    const svgId = 'erd-svg';

    mermaid.render(svgId, diagramCode).then((res) => {
      setSvgContent(res.svg);
    });
  }, [diagramCode]);

  return (
    <Spin spinning={!svgContent}>
      <S.ERDContainer>
        <TransformWrapper initialScale={1} initialPositionX={50} initialPositionY={0}>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <>
              <CustomToolbar
                className="tools"
                handleZoomIn={zoomIn}
                handleZoomOut={zoomOut}
                handleReset={resetTransform}
              />
              <TransformComponent>
                {svgContent && <div className="w-screen" dangerouslySetInnerHTML={{ __html: svgContent }} />}
              </TransformComponent>
            </>
          )}
        </TransformWrapper>
      </S.ERDContainer>
    </Spin>
  );
};
