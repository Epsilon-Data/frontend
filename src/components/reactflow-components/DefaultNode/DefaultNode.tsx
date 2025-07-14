import { NodeProps, Position } from 'reactflow';
import * as S from './DefaultNode.styles';
import { getHandleConfig, NodeData } from '@app/constants/reactflow';

interface ReadOnlyNodeProps extends NodeProps<NodeData> {
  type: string;
}

export function DefaultNode({ data, type, id }: ReadOnlyNodeProps) {
  const typeColor =
    type === 'object' ? '#ff6666' : type === 'category' ? '#ff8833' : type === 'subcategory' ? '#33b1ff' : '#ffffff';

  const { showSource, showTarget } = getHandleConfig(type);

  return (
    <S.DefaultNodeWrapper style={{ background: typeColor }} className="default-node">
      <S.TextDisplay id={id}>{data.label}</S.TextDisplay>
      {showTarget && <S.DefaultHandle type="target" position={Position.Top} />}
      {showSource && <S.DefaultHandle type="source" position={Position.Bottom} />}
    </S.DefaultNodeWrapper>
  );
}
