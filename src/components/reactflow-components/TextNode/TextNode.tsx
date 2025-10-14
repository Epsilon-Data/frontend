import { Position, NodeProps } from '@xyflow/react';
import * as S from './TextNode.styles';
import { useMemo, useState } from 'react';
import { NodeData } from '@app/constants/reactflow/types';
import { getLevelColor } from '@app/constants/reactflow/reactflowOptions';

export function TextNode({ data }: NodeProps<NodeData>) {
  const [isEditing, setEditing] = useState(false);

  const { showSource, showTarget } = {
    showSource: true,
    showTarget: data.level > 0,
  };

  const handleDoubleClick = () => {
    setEditing(true);
  };

  const handleBlur = () => {
    setEditing(false);
  };

  const levelColor = useMemo(() => getLevelColor(data.level), [data.level]);

  const handleChange = (e: { target: { value: string } }) => {
    data.label = e.target.value;
  };

  return (
    <S.TextNodeWrapper style={{ background: levelColor }} className="text-node">
      {isEditing ? (
        <S.TextNodeInput defaultValue={data.label} onChange={handleChange} onBlur={handleBlur} autoFocus />
      ) : (
        <S.TextDisplay onDoubleClick={handleDoubleClick}>{data.label}</S.TextDisplay>
      )}
      {showTarget && <S.TextHandle type="target" position={Position.Top} />}
      {showSource && <S.TextHandle type="source" position={Position.Bottom} />}
    </S.TextNodeWrapper>
  );
}
