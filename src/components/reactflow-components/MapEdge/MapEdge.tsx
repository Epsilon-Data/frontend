import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';

export function MapEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY } = props;

  const [edgePath] = getBezierPath({
    sourceX: sourceX + 5,
    sourceY: sourceY + 5,
    targetX,
    targetY: targetY - 5,
  });

  return <BaseEdge path={edgePath} {...props} style={{ stroke: '#808080', strokeWidth: '1.5px' }} />;
}
