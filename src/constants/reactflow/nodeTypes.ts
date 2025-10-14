import { DefaultNode } from '@app/components/reactflow-components/DefaultNode/DefaultNode';
import { TextNode } from '@app/components/reactflow-components/TextNode/TextNode';
import { ColumnNode } from '@app/components/reactflow-components/ColumnNode/ColumnNode';
import { SubcategoryNode } from '@app/components/reactflow-components/SubcategoryNode/SubcategoryNode';

export const nodeTypes = {
  edit: TextNode,
  read: DefaultNode,
  subcategory: SubcategoryNode,
  column: ColumnNode,
};
