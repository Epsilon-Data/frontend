import { Node, NodeProps, Position } from '@xyflow/react';
import * as S from './DefaultNode.styles';
import { NodeData } from '@app/constants/reactflow/types';
import { getLevelColor } from '@app/constants/reactflow/reactflowOptions';
import { useMemo } from 'react';

type DefaultNodeProps = NodeProps<Node<NodeData, 'read'>>;

export function DefaultNode({ data, id }: DefaultNodeProps) {
  const levelColor = useMemo(() => getLevelColor(data.level), [data.level]);

  return (
    <S.DefaultNodeWrapper style={{ background: levelColor }} className="default-node">
      <S.TextDisplay id={id}>{data.label}</S.TextDisplay>
      <S.DefaultHandle type="source" position={Position.Top} />
      <S.DefaultHandle type="target" position={Position.Bottom} />
    </S.DefaultNodeWrapper>
  );
}
