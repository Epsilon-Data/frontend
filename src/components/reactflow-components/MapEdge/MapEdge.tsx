import { BaseEdge, EdgeProps, getStraightPath } from 'reactflow';

interface MapEdgeProps extends EdgeProps {
  mode?: 'editable' | 'mapping' | 'readonly';
}

export function MapEdge(props: MapEdgeProps) {
  const { sourceX, sourceY, targetX, targetY, mode = 'editable' } = props;

  let offset = 5;

  if (mode === 'mapping' || mode === 'readonly') {
    offset = -5;
  }

  const [edgePath] = getStraightPath({
    sourceX,
    sourceY: sourceY + offset,
    targetX,
    targetY: targetY - offset,
  });

  return <BaseEdge path={edgePath} {...props} style={{ stroke: '#808080', strokeWidth: '1.5px' }} />;
}
