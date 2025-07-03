/* eslint-disable @typescript-eslint/no-explicit-any */
import { Position, NodeProps } from 'reactflow';
import * as S from './TextNode.styles';
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
    type === 'object' ? '#ff6666' : type === 'category' ? '#ff8833' : type === 'subcategory' ? '#33b1ff' : '#ffffff';

  const handleChange = (e: any) => {
    data.label = e.target.value;
  };

  return (
    <S.TextNodeWrapper style={{ background: typeColor }} className="text-node">
      {isEditing ? (
        <S.TextNodeInput defaultValue={data.label} onChange={handleChange} onBlur={handleBlur} autoFocus />
      ) : (
        <S.TextDisplay onDoubleClick={handleDoubleClick}>{data.label}</S.TextDisplay>
      )}
      <S.TextHandle type="target" position={Position.Top} />
      <S.TextHandle type="source" position={Position.Top} />
    </S.TextNodeWrapper>
  );
}
