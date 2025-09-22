import { BaseEdge, EdgeProps, getStraightPath } from 'reactflow';

export function MapEdge(props: EdgeProps) {
  const { sourceX, sourceY, targetX, targetY } = props;

  const offset = 5;

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY: sourceY + offset,
    targetX,
    targetY: targetY - offset,
  });

  return <BaseEdge path={edgePath} {...props} style={{ stroke: '#808080', strokeWidth: '1.5px' }} />;
}
