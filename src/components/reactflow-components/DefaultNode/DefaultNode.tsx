/* eslint-disable @typescript-eslint/no-explicit-any */
import { NodeProps, Position } from 'reactflow';
import * as S from './DefaultNode.styles';

export type NodeData = {
  label: string;
};

export function DefaultNode({ data, type, id }: NodeProps<NodeData>) {
  const typeColor =
    type === 'object'
      ? 'var(--element-object-bg)'
      : type === 'category'
      ? 'var(--element-category-bg)'
      : type === 'subcategory'
      ? 'var(--element-subcategory-bg)'
      : 'var(--white)';

  return (
    <S.DefaultNodeWrapper style={{ background: typeColor }} className="default-node">
      <S.TextDisplay id={id}>{data.label}</S.TextDisplay>
      <S.DefaultHandle type="target" position={Position.Top} />
      <S.DefaultHandle type="source" position={Position.Bottom} />
    </S.DefaultNodeWrapper>
  );
}
