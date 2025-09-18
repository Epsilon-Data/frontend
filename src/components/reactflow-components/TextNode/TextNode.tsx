import { Position, NodeProps } from 'reactflow';
import * as S from './TextNode.styles';
import { useState } from 'react';
import { NodeLabelData } from '@app/constants/reactflow/types';

export interface TypedNodeProps extends NodeProps<NodeLabelData> {
  type: string;
}

export function TextNode({ data, type }: TypedNodeProps) {
  const [isEditing, setEditing] = useState(false);

  const { showSource, showTarget } = {
    showSource: type === 'object' || type === 'category' || type === 'column',
    showTarget: type === 'category' || type === 'subcategory',
  };

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
  };

  const typeColor =
    type === 'object' ? '#ff6666' : type === 'category' ? '#ff8833' : type === 'subcategory' ? '#33b1ff' : '#ffffff';

  const handleChange = (e: { target: { value: string } }) => {
    data.label = e.target.value;
  };

  return (
    <S.TextNodeWrapper style={{ background: typeColor }} className="text-node">
      {isEditing ? (
        <S.TextNodeInput defaultValue={data.label} onChange={handleChange} onBlur={handleBlur} autoFocus />
      ) : (
        <S.TextDisplay onDoubleClick={handleDoubleClick}>{data.label}</S.TextDisplay>
      )}

      {showSource && <S.TextHandle type="source" position={Position.Top} />}
      {showTarget && <S.TextHandle type="target" position={Position.Bottom} />}
    </S.TextNodeWrapper>
  );
}
