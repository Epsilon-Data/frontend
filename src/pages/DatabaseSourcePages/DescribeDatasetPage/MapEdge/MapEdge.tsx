import { BaseEdge, EdgeProps, getStraightPath } from 'reactflow';

export function MapEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY } = props;

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY: sourceY + 30,
    targetX,
    targetY,
  });

  return <BaseEdge path={edgePath} {...props} style={{ stroke: 'var(--gray)', strokeWidth: '3px' }} />;
}
