import { BaseEdge, EdgeProps, getStraightPath } from 'reactflow';

export function MapEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY } = props;

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY: sourceY + 5,
    targetX,
    targetY: targetY + 5,
  });

  return <BaseEdge path={edgePath} {...props} style={{ stroke: 'var(--gray)', strokeWidth: '1.5px' }} />;
}
