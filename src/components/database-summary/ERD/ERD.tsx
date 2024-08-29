import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import * as S from './ERD.styles';
import { TransformWrapper, TransformComponent } from 'react-zoom-pan-pinch';

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
    if (diagramCode) {
      mermaid.initialize({ startOnLoad: true });
      mermaid.render('erd-container', diagramCode).then((res) => {
        setSvgContent(res.svg);
      });
    }
  }, [diagramCode]);

  return (
    <>
      {svgContent !== null ? (
        <TransformWrapper initialScale={1} initialPositionX={200} initialPositionY={0}>
          {({ zoomIn, zoomOut, resetTransform }) => (
            <React.Fragment>
              <CustomToolbar
                className="tools"
                handleZoomIn={() => zoomIn()}
                handleZoomOut={() => zoomOut()}
                handleReset={() => resetTransform()}
              />
              <TransformComponent>
                <S.DiagramArea id="erd-container" dangerouslySetInnerHTML={{ __html: svgContent }} />
              </TransformComponent>
            </React.Fragment>
          )}
        </TransformWrapper>
      ) : (
        <BaseSpin size="default" />
      )}
    </>
  );
};
