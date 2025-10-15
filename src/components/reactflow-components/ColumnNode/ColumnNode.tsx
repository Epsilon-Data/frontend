/* eslint-disable @typescript-eslint/no-explicit-any */
import { Node, Position, NodeProps } from '@xyflow/react';
import * as S from './ColumnNode.styles';
import { NodeData } from '@app/constants/reactflow/types';

type ColumnNodeProps = NodeProps<Node<NodeData, 'column'>>;

export function ColumnNode({ data }: ColumnNodeProps) {
  return (
    <S.ColumnNodeWrapper className="column-node">
      <S.ColumnDisplay>{data.label}</S.ColumnDisplay>
      <S.ColumnHandle type="target" position={Position.Bottom} />
    </S.ColumnNodeWrapper>
  );
}
