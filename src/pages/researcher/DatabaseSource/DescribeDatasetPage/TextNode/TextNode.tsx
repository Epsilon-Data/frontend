/* eslint-disable @typescript-eslint/no-explicit-any */
import { Position, NodeProps, Handle } from 'reactflow';
import * as S from './TextNode.styles';
import { RxDragHandleDots2 } from 'react-icons/rx';
import { useState } from 'react';

export type NodeData = {
  label: string;
};

export function TextNode({ data, type }: NodeProps<NodeData>) {
  const [isEditing, setEditing] = useState(false);

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
  };

  const typeColor =
    type === 'object'
      ? 'var(--element-object-bg)'
      : type === 'category'
      ? 'var(--element-category-bg)'
      : type === 'subcategory'
      ? 'var(--element-subcategory-bg)'
      : 'var(--white)';

  const handleChange = (e: any) => {
    data.label = e.target.value;
  };

  return (
    <S.TextNodeWrapper style={{ background: typeColor }}>
      <RxDragHandleDots2 size={30} style={{ position: 'relative', top: '0.5rem' }} />
      {isEditing ? (
        <S.TextNodeInput defaultValue={data.label} onChange={handleChange} onBlur={handleBlur} autoFocus />
      ) : (
        <S.TextDisplay onDoubleClick={handleDoubleClick}>{data.label}</S.TextDisplay>
      )}
      <Handle type="target" position={Position.Top} />
      <Handle type="source" position={Position.Top} />
    </S.TextNodeWrapper>
  );
}
