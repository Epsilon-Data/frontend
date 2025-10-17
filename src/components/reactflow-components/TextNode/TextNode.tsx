import { Node, Position, NodeProps, useReactFlow } from '@xyflow/react';
import * as S from './TextNode.styles';
import { useMemo, useState } from 'react';
import { NodeData } from '@app/constants/reactflow/types';
import { getColors } from '@app/constants/reactflow/reactflowOptions';

type TextNodeProps = NodeProps<Node<NodeData>>;

export function TextNode({ id, data, selected }: TextNodeProps) {
  const rf = useReactFlow();
  const [isEditing, setEditing] = useState(false);
  const showTarget = data.level > 0;

  const handleDoubleClick = () => setEditing(true);

  const handleBlur = () => setEditing(false);

  const { levelColor, textColor } = useMemo(() => getColors(data.level), [data.level]);

  const handleChange = (e: { target: { value: string } }) => {
    const nextLabel = e.target.value;
    rf.setNodes((nodes) => nodes.map((n) => (n.id === id ? { ...n, data: { ...n.data, label: nextLabel } } : n)));
  };

  return (
    <S.TextNodeWrapper style={{ background: levelColor }} className="text-node" $selected={selected}>
      {isEditing ? (
        <S.TextNodeInput
          defaultValue={data.label}
          onChange={handleChange}
          onBlur={handleBlur}
          autoFocus
          style={{ color: textColor }}
        />
      ) : (
        <S.TextDisplay onDoubleClick={handleDoubleClick} style={{ color: textColor }}>
          {data.label}
        </S.TextDisplay>
      )}
      {showTarget && <S.TextHandle type="target" position={Position.Top} />}
      <S.TextHandle type="source" position={Position.Bottom} />
    </S.TextNodeWrapper>
  );
}
