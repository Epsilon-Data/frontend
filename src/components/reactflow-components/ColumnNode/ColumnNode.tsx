/* eslint-disable @typescript-eslint/no-explicit-any */
import { Position, NodeProps } from 'reactflow';
import * as S from './ColumnNode.styles';
import { NodeLabelData } from '@app/constants/reactflow/types';

export function ColumnNode({ data }: NodeProps<NodeLabelData>) {
  return (
    <S.ColumnNodeWrapper className="column-node">
      <S.ColumnDisplay>{data.label}</S.ColumnDisplay>
      <S.ColumnHandle type="target" position={Position.Bottom} />
    </S.ColumnNodeWrapper>
  );
}
