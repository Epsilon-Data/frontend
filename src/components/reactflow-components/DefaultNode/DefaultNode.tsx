import { NodeProps, Position } from 'reactflow';
import * as S from './DefaultNode.styles';
import { NodeLabelData } from '@app/constants/reactflow/types';

interface ReadOnlyNodeProps extends NodeProps<NodeLabelData> {
  type: string;
}

export function DefaultNode({ data, type, id }: ReadOnlyNodeProps) {
  const typeColor =
    type === 'object' ? '#ff6666' : type === 'category' ? '#ff8833' : type === 'subcategory' ? '#33b1ff' : '#ffffff';

  return (
    <S.DefaultNodeWrapper style={{ background: typeColor }} className="default-node">
      <S.TextDisplay id={id}>{data.label}</S.TextDisplay>
      <S.DefaultHandle type="target" position={Position.Top} />
      <S.DefaultHandle type="source" position={Position.Bottom} />
    </S.DefaultNodeWrapper>
  );
}
