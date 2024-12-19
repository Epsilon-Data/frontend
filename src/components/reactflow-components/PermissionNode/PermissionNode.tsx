/* eslint-disable @typescript-eslint/no-explicit-any */
import { NodeProps, Position } from 'reactflow';
import * as S from './PermissionNode.styles';

export type NodeData = {
  label: string;
};

export function PermissionNode({ data, type, id }: NodeProps<NodeData>) {
  const typeColor =
    type === 'object'
      ? 'var(--element-object-bg)'
      : type === 'category'
      ? 'var(--element-category-bg)'
      : type === 'subcategory'
      ? 'var(--element-subcategory-bg)'
      : 'var(--white)';

  return (
    <S.PermissionNodeWrapper style={{ background: typeColor }} className="permission-node">
      <S.TextDisplay id={id}>{data.label}</S.TextDisplay>
      <S.PermissionHandle type="target" position={Position.Top} />
      <S.PermissionHandle type="source" position={Position.Top} />
    </S.PermissionNodeWrapper>
  );
}
