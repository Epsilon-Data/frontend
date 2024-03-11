/* eslint-disable @typescript-eslint/no-explicit-any */
import { Position, NodeProps, Handle } from 'reactflow';
import * as S from './ColumnNode.styles';

export type NodeData = {
  label: string;
};

export function ColumnNode({ data }: NodeProps<NodeData>) {
  return (
    <S.ColumnNodeWrapper>
      <S.ColumnDisplay>{data.label}</S.ColumnDisplay>
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} />
    </S.ColumnNodeWrapper>
  );
}
