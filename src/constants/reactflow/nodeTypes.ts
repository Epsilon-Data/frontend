import { DefaultNode } from '@app/components/reactflow-components/DefaultNode/DefaultNode';
import { TextNode } from '@app/components/reactflow-components/TextNode/TextNode';
import { ColumnNode } from '@app/components/reactflow-components/ColumnNode/ColumnNode';
import { SubcategoryNode } from '@app/components/reactflow-components/SubcategoryNode/SubcategoryNode';

export const editableNodeTypes = {
  object: TextNode,
  category: TextNode,
  subcategory: TextNode,
};

export const readonlyNodeTypes = {
  object: DefaultNode,
  category: DefaultNode,
  subcategory: DefaultNode,
};

export const mappingNodeTypes = {
  object: DefaultNode,
  category: DefaultNode,
  subcategory: SubcategoryNode,
  column: ColumnNode,
};
