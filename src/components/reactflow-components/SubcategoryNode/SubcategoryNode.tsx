import { Position, NodeProps } from '@xyflow/react';
import * as S from './SubcategoryNode.styles';
import { NodeData } from '@app/constants/reactflow/types';

export function SubcategoryNode({ data, selected }: NodeProps<NodeData>) {
  return (
    <S.SubcategoryNodeWrapper className="subcategory-node" $selected={selected}>
      <S.SubcategoryDisplay>{data.label}</S.SubcategoryDisplay>
      <S.SubcategoryHandle type="source" position={Position.Top} />
      <S.SubcategoryHandle type="target" position={Position.Bottom} />
    </S.SubcategoryNodeWrapper>
  );
}
