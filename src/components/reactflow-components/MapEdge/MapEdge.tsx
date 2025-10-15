import { BaseEdge, EdgeProps, getBezierPath } from '@xyflow/react';

export function MapEdge(props: EdgeProps) {
  const {
    id,
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
    markerStart,
    markerEnd,
    style,
    interactionWidth,
  } = props;

  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    targetX,
    targetY,
    sourcePosition,
    targetPosition,
  });

  return (
    <BaseEdge
      id={id}
      path={edgePath}
      markerStart={markerStart}
      markerEnd={markerEnd}
      interactionWidth={interactionWidth}
      style={{ stroke: '#808080', strokeWidth: 1.5, ...style }} // use number for strokeWidth
    />
  );
}
