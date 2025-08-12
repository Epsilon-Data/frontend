/* eslint-disable @typescript-eslint/no-explicit-any */
import { Position, NodeProps } from 'reactflow';
import * as S from './ColumnNode.styles';

export type NodeData = {
  label: string;
};

export function ColumnNode({ data }: NodeProps<NodeData>) {
  return (
    <S.ColumnNodeWrapper className="column-node">
      <S.ColumnDisplay>{data.label}</S.ColumnDisplay>
      <S.ColumnHandle type="target" position={Position.Top} />
      <S.ColumnHandle type="source" position={Position.Bottom} />
    </S.ColumnNodeWrapper>
  );
}
