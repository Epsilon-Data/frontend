import React, { useEffect, useState } from 'react';
import mermaid from 'mermaid';
import { BaseSpin } from '@app/components/common/BaseSpin/BaseSpin';
import * as S from './ERD.styles';

export const ERD: React.FC<{ diagramCode: string }> = ({ diagramCode }) => {
  const [svgContent, setSvgContent] = useState<string | null>(null);
  useEffect(() => {
    mermaid.initialize({ startOnLoad: true });
    mermaid.render('erd-container', diagramCode).then((res) => {
      setSvgContent(res.svg);
    });
  }, [diagramCode]);

  return (
    <div>
      {svgContent !== null ? (
        <S.DiagramArea id="erd-container" dangerouslySetInnerHTML={{ __html: svgContent }} />
      ) : (
        <BaseSpin size="default" />
      )}
    </div>
  );
};
