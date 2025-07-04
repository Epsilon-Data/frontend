import { BaseEdge, EdgeProps, getBezierPath } from 'reactflow';

export function MapEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY } = props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY: sourceY + 10,
    targetX,
    targetY: targetY + 10,
  });

  return <BaseEdge path={edgePath} {...props} style={{ stroke: '#808080', strokeWidth: '1.5px' }} />;
}
