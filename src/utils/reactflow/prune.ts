import type { Edge, Node } from '@xyflow/react';
import type { ColumnInfo } from '@app/api/database.api';

export function pruneDirectColumnChildren(params: {
  parentId: string;
  nodes: Node[];
  edges: Edge[];
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  onColumnRemoved?: (col: ColumnInfo) => void;
}) {
  const { parentId, nodes, edges, setNodes, setEdges, onColumnRemoved } = params;

  const directColumnEdgeIds = new Set(edges.filter((e) => e.source === parentId).map((e) => e.id));

  if (directColumnEdgeIds.size === 0) return;

  const byId = new Map(nodes.map((n) => [n.id, n]));
  const columnNodeIds = new Set<string>();

  for (const e of edges) {
    if (!directColumnEdgeIds.has(e.id)) continue;
    const tgt = byId.get(e.target);
    if (tgt?.type === 'column') {
      columnNodeIds.add(tgt.id);
    }
  }

  if (columnNodeIds.size === 0) return;

  if (onColumnRemoved) {
    for (const id of columnNodeIds) {
      const n = byId.get(id);
      if (!n) continue;
      const d = (n.data ?? {}) as { label?: string; table?: string };
      onColumnRemoved({
        id: n.id,
        name: typeof d.label === 'string' ? d.label : '',
        table: typeof d.table === 'string' ? d.table : '',
      });
    }
  }

  setNodes((nds) => nds.filter((n) => !columnNodeIds.has(n.id)));
  setEdges((eds) =>
    eds.filter(
      (e) =>
        !columnNodeIds.has(e.source) &&
        !columnNodeIds.has(e.target) &&
        !(e.source === parentId && columnNodeIds.has(e.target)),
    ),
  );
}
