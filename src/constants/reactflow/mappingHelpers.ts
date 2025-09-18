import type { Dispatch, SetStateAction } from 'react';
import type { Edge, Node } from 'reactflow';
import type { SubcatNodeData } from '@app/components/reactflow-components/SubcategoryNode/SubcategoryNode';

export function enhanceMappingNodes(params: {
  nodes: Node[];
  edges: Edge[];
  columns?: string[];
  setEdges: Dispatch<SetStateAction<Edge[]>>;
}) {
  const { nodes, edges, columns, setEdges } = params;
  if (!columns) return nodes;

  return nodes.map((node) => {
    if (node.type !== 'subcategory') return node;

    const connectedCols = edges
      .filter((e) => e.source === node.id || e.target === node.id)
      .map((e) => (e.source === node.id ? e.target : e.source))
      .map((id) => nodes.find((n) => n.id === id)?.data?.label)
      .filter(Boolean) as string[];

    const availableColumns = columns.filter((c) => !connectedCols.includes(c));

    const onColumnSelect = (columnName: string) => {
      const columnNode = nodes.find((n) => n.type === 'column' && n.data?.label === columnName);
      if (!columnNode) return;

      // Enforce 1:1 mapping
      setEdges((eds) =>
        eds.filter(
          (e) =>
            e.source !== node.id && e.target !== node.id && e.source !== columnNode.id && e.target !== columnNode.id,
        ),
      );

      const newEdge: Edge = {
        id: `edge-${node.id}-${columnNode.id}`,
        source: node.id,
        target: columnNode.id,
        type: 'default',
      };
      setEdges((eds) => [...eds, newEdge]);
    };

    return {
      ...node,
      data: { ...node.data, availableColumns, onColumnSelect } as SubcatNodeData,
    };
  });
}

export function createNodeColumnMapping(nodes: Node[], edges: Edge[]) {
  const columnIds = nodes.filter((n) => n.type === 'column').map((n) => n.id);
  const filtered = edges.filter((e) => columnIds.includes(e.source) || columnIds.includes(e.target));
  if (!filtered.length) return null;

  type MappingRow = { nodeId: string; nodeName: string; nodeType?: string; columns: string[] };
  const result: MappingRow[] = [];
  const isColumn = (n: Node) => n?.type === 'column';

  filtered.forEach((e) => {
    const s = nodes.find((n) => n.id === e.source)!;
    const t = nodes.find((n) => n.id === e.target)!;

    const nodeId = isColumn(s) ? t.id : s.id;
    const nodeName = (isColumn(s) ? t.data : s.data) as { label?: string };
    const columnName = (isColumn(s) ? s.data : t.data) as { label?: string };

    const resolvedName = nodeName?.label ?? '';
    const resolvedCol = columnName?.label ?? '';
    if (!resolvedName || !resolvedCol) return;

    const idx = result.findIndex((r) => r.nodeName === resolvedName);
    if (idx === -1) {
      result.push({ nodeId, nodeName: resolvedName, nodeType: isColumn(s) ? t.type : s.type, columns: [resolvedCol] });
    } else {
      result[idx].columns.push(resolvedCol);
    }
  });

  return result;
}

export function transformColumns(
  nodeMap: { nodeId: string; nodeName: string; nodeType?: string; columns: string[] }[],
  tableMap: Record<string, string>,
) {
  return nodeMap.map((category) => ({
    ...category,
    columns: category.columns.map((c) => ({ name: c, table: tableMap[c] })),
  }));
}
