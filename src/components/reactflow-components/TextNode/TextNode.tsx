import { Position, NodeProps } from 'reactflow';
import * as S from './TextNode.styles';
import { useState } from 'react';
import { getHandleConfig, NodeData } from '@app/constants/reactflow';

interface TypedNodeProps extends NodeProps<NodeData> {
  type: string;
}

export function TextNode({ data, type }: TypedNodeProps) {
  const [isEditing, setEditing] = useState(false);

  const { showSource, showTarget } = getHandleConfig(type);

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
