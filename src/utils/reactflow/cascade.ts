import type { Edge, Node, NodeChange } from '@xyflow/react';
import type { ColumnInfo } from '@app/api/database.api';

export type CascadeOptions = {
  follow?: 'out' | 'in' | 'both';
  onColumnRemoved?: (col: ColumnInfo) => void;
  isColumn?: (n?: Node) => boolean;
  isCategory?: (n?: Node) => boolean;
};

function buildAdjacency(edges: Edge[]) {
  const out = new Map<string, Edge[]>();
  const inc = new Map<string, Edge[]>();
  for (const e of edges) {
    if (!out.has(e.source)) out.set(e.source, []);
    out.get(e.source)!.push(e);
    if (!inc.has(e.target)) inc.set(e.target, []);
    inc.get(e.target)!.push(e);
  }
  return { out, inc };
}

export function computeCascade(nodes: Node[], edges: Edge[], removedRootIds: Set<string>, opts: CascadeOptions = {}) {
  const follow = opts.follow ?? 'out';
  const byId = new Map(nodes.map((n) => [n.id, n as Node]));
  const { out, inc } = buildAdjacency(edges);

  const nodeIdsToRemove = new Set<string>(removedRootIds);
  const edgesToRemove = new Set<string>();
  const stack = [...removedRootIds];

  const pushOutgoing = (id: string) => {
    for (const e of out.get(id) ?? []) {
      edgesToRemove.add(e.id);
      const tgt = e.target;
      if (!nodeIdsToRemove.has(tgt)) {
        nodeIdsToRemove.add(tgt);
        stack.push(tgt);
      }
    }
  };
  const pushIncoming = (id: string) => {
    for (const e of inc.get(id) ?? []) {
      edgesToRemove.add(e.id);
      const src = e.source;
      if (!nodeIdsToRemove.has(src)) {
        nodeIdsToRemove.add(src);
        stack.push(src);
      }
    }
  };

  while (stack.length) {
    const cur = stack.pop()!;
    if (follow === 'out') pushOutgoing(cur);
    else if (follow === 'in') pushIncoming(cur);
    else {
      pushOutgoing(cur);
      pushIncoming(cur);
    }
  }

  for (const e of edges) {
    if (nodeIdsToRemove.has(e.source) || nodeIdsToRemove.has(e.target)) {
      edgesToRemove.add(e.id);
    }
  }

  const toAddBack: ColumnInfo[] = [];
  if (opts.onColumnRemoved && opts.isColumn) {
    for (const id of nodeIdsToRemove) {
      const n = byId.get(id);
      if (!n) continue;
      if (opts.isColumn(n)) {
        const d = (n.data ?? {}) as { label?: string; table?: string };
        toAddBack.push({
          id: n.id,
          name: typeof d.label === 'string' ? d.label : '',
          table: typeof d.table === 'string' ? d.table : '',
        });
      }
    }
  }

  return { nodeIdsToRemove, edgesToRemove, toAddBack };
}

export function handleCascadeNodeChanges(
  params: {
    changes: NodeChange[];
    nodes: Node[];
    edges: Edge[];
    onNodesChange: (changes: NodeChange[]) => void;
    setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
    setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  },
  opts: CascadeOptions,
) {
  const { changes, nodes, edges, onNodesChange, setNodes, setEdges } = params;
  onNodesChange(changes);

  const removedRootIds = new Set(changes.filter((c) => c.type === 'remove').map((c) => c.id));
  if (removedRootIds.size === 0) return;

  const { nodeIdsToRemove, edgesToRemove, toAddBack } = computeCascade(nodes, edges, removedRootIds, opts);

  if (nodeIdsToRemove.size || edgesToRemove.size) {
    setNodes((nds) => nds.filter((n) => !nodeIdsToRemove.has(n.id)));
    setEdges((eds) => eds.filter((e) => !edgesToRemove.has(e.id)));
  }

  if (opts.onColumnRemoved && toAddBack.length) {
    toAddBack.forEach(opts.onColumnRemoved);
  }

  return { removedNodeIds: nodeIdsToRemove, removedEdgeIds: edgesToRemove };
}
