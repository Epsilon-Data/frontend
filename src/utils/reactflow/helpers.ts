import { Permission, PermissionType } from '@app/api/archetypes.api';
import { GraphEdgePayload, GraphNodePayload } from '@app/api/job.api';
import { NodeData } from '@app/constants/reactflow/types';
import { Node, Edge } from '@xyflow/react';

const COLUMN_Y_OFFSET = 150;
const ROW_GAP = 64;
const COL_GAP = 220;
const MAX_ROWS = 6;

export type RowType = 'category' | 'leaf';

export type PermissionTableRow = {
  key: string;
  label: string;
  kind: RowType;
  parentId?: string;
  topCategoryId?: string;
  level?: number;
  children?: PermissionTableRow[];
};

export function computeNextColumnPosition(
  subcatId: string,
  nodes: Node[],
  edges: Edge[],
  baseX: number,
  baseY: number,
) {
  const connectedIds = edges
    .filter((e) => e.source === subcatId || e.target === subcatId)
    .map((e) => (e.source === subcatId ? e.target : e.source));

  const connectedCols = connectedIds
    .map((id) => nodes.find((n) => n.id === id))
    .filter((n): n is Node => Boolean(n && n.type === 'column'));

  const count = connectedCols.length;

  const colIndex = Math.floor(count / MAX_ROWS);
  const rowIndex = count % MAX_ROWS;

  const x = baseX + colIndex * COL_GAP;
  const y = baseY + COLUMN_Y_OFFSET + rowIndex * ROW_GAP;

  return { x, y };
}

export function findUnmappedLeafs(nodes: Node[], edges: Edge[]) {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const missing: string[] = [];
  const outMap = new Map<string, Edge[]>();
  edges.forEach((e) => {
    const arr = outMap.get(e.source);
    if (arr) arr.push(e);
    else outMap.set(e.source, [e]);
  });

  nodes.forEach((n) => {
    if (n.type !== 'category') return;

    const outs = outMap.get(n.id) ?? [];
    const hasCategoryChild = outs.some((e) => byId.get(e.target)?.type === 'category');

    if (!hasCategoryChild) {
      const columnLinks = outs.filter((e) => byId.get(e.target)?.type === 'column').length;
      if (columnLinks !== 1) {
        const label = (n.data as { label: string })?.label ?? n.id;
        missing.push(label);
      }
    }
  });

  return missing;
}

export function findDuplicateChildLabels(nodes: Node[], edges: Edge[]) {
  const byId = new Map(nodes.map((n) => [n.id, n]));

  const childLabelsByParent = new Map<string, string[]>();
  edges.forEach((e) => {
    const parent = byId.get(e.source);
    const child = byId.get(e.target);
    if (!parent || !child) return;

    const parentType = parent.type ?? '';
    if (parentType !== 'category' && parentType !== 'root') return;

    const label = (child.data as { label?: string })?.label?.trim();
    if (!label) return;

    const list = childLabelsByParent.get(parent.id);
    if (list) list.push(label);
    else childLabelsByParent.set(parent.id, [label]);
  });

  const issues: Array<{
    parentId: string;
    parentLabel: string;
    labels: string[];
    conflictsWithParent: string[];
  }> = [];

  for (const [parentId, childLabels] of childLabelsByParent.entries()) {
    const parentNode = byId.get(parentId);
    const parentLabelRaw = (parentNode?.data as { label?: string })?.label ?? parentId;
    const parentLabel = parentLabelRaw.trim();

    const counts = new Map<string, number>();
    childLabels.forEach((l) => counts.set(l, (counts.get(l) ?? 0) + 1));
    const dupChildLabels = [...counts.entries()].filter(([, c]) => c > 1).map(([l]) => l);

    const conflictsWithParent = Array.from(new Set(childLabels.filter((l) => l === parentLabel)));

    if (dupChildLabels.length || conflictsWithParent.length) {
      issues.push({
        parentId,
        parentLabel,
        labels: dupChildLabels,
        conflictsWithParent,
      });
    }
  }

  return issues;
}

export function findOrphanedNodes(nodes: Node[], edges: Edge[]): string[] {
  const root = nodes.find((n) => n.type === 'root');
  if (!root) return [];

  const outMap = new Map<string, string[]>();
  for (const e of edges) {
    const list = outMap.get(e.source);
    if (list) list.push(e.target);
    else outMap.set(e.source, [e.target]);
  }

  const visited = new Set<string>();
  const queue = [root.id];
  visited.add(root.id);

  while (queue.length) {
    const current = queue.shift()!;
    for (const neighbor of outMap.get(current) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }

  return nodes
    .filter((n) => n.type !== 'root' && !visited.has(n.id))
    .map((n) => (n.data as { label?: string })?.label ?? n.id);
}

export function findEmptyLabels(nodes: Node[]): string[] {
  return nodes
    .filter((n) => {
      const label = (n.data as { label?: string })?.label;
      return !label || !label.trim();
    })
    .map((n) => n.id);
}

export function findColumnIntegrityIssues(
  nodes: Node[],
  edges: Edge[],
): { columnId: string; columnLabel: string; parentCount: number }[] {
  const columnNodes = nodes.filter((n) => n.type === 'column');
  const issues: { columnId: string; columnLabel: string; parentCount: number }[] = [];

  for (const col of columnNodes) {
    const parentCount = edges.filter((e) => e.target === col.id).length;
    if (parentCount !== 1) {
      const label = (col.data as { label?: string })?.label ?? col.id;
      issues.push({ columnId: col.id, columnLabel: label, parentCount });
    }
  }

  return issues;
}

export function findMixedChildrenNodes(nodes: Node[], edges: Edge[]): string[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const mixed: string[] = [];

  for (const node of nodes) {
    if (node.type !== 'category' && node.type !== 'root') continue;

    const children = edges.filter((e) => e.source === node.id).map((e) => byId.get(e.target));
    const hasCategoryChild = children.some((c) => c?.type === 'category');
    const hasColumnChild = children.some((c) => c?.type === 'column');

    if (hasCategoryChild && hasColumnChild) {
      const label = (node.data as { label?: string })?.label ?? node.id;
      mixed.push(label);
    }
  }

  return mixed;
}

export function findEmptyRoot(nodes: Node[], edges: Edge[]): boolean {
  const root = nodes.find((n) => n.type === 'root');
  if (!root) return true;
  return !edges.some((e) => e.source === root.id);
}

export function findDuplicateEdges(edges: Edge[]): { source: string; target: string; count: number }[] {
  const counts = new Map<string, { source: string; target: string; count: number }>();

  for (const e of edges) {
    const key = `${e.source}->${e.target}`;
    const existing = counts.get(key);
    if (existing) {
      existing.count++;
    } else {
      counts.set(key, { source: e.source, target: e.target, count: 1 });
    }
  }

  return [...counts.values()].filter((entry) => entry.count > 1);
}

function buildAdjacency(edges: Edge[]) {
  const out = new Map<string, string[]>();
  const inMap = new Map<string, string[]>();
  for (const e of edges) {
    (out.get(e.source) ?? out.set(e.source, []).get(e.source)!).push(e.target);
    (inMap.get(e.target) ?? inMap.set(e.target, []).get(e.target)!).push(e.source);
  }
  return { out, inMap };
}

export function graphToTableRows(nodes: Node[], edges: Edge[]): PermissionTableRow[] {
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const { out, inMap } = buildAdjacency(edges);
  const childrenOf = (id: string) => out.get(id) ?? [];
  const labelOf = (id: string) => String((byId.get(id)?.data as { label: string })?.label ?? id);

  const rootIds = nodes.filter((n) => n.type === 'root').map((n) => n.id);
  const catUnderRoot = new Set<string>();
  for (const r of rootIds) for (const c of childrenOf(r)) if (byId.get(c)?.type === 'category') catUnderRoot.add(c);

  const categories = nodes.filter((n) => n.type === 'category');
  const topCats = catUnderRoot.size
    ? [...catUnderRoot]
    : categories.filter((n) => !(inMap.get(n.id) ?? []).some((p) => byId.get(p)?.type === 'category')).map((n) => n.id);

  const isLeafCategory = (catId: string) => childrenOf(catId).some((cid) => byId.get(cid)?.type === 'column');

  const getNodeLevel = (id: string): number => {
    const raw = (byId.get(id)?.data as { level: number })?.level;
    return Number(raw);
  };

  const buildCategory = (id: string, topId: string, parentId?: string): PermissionTableRow => {
    const subcats = childrenOf(id)
      .map((cid) => byId.get(cid))
      .filter((n) => n && n.type === 'category') as Node[];

    const children = subcats.map((n) => buildCategory(n.id, topId, id)).sort((a, b) => a.label.localeCompare(b.label));

    return {
      key: id,
      label: labelOf(id),
      kind: isLeafCategory(id) ? 'leaf' : 'category',
      parentId,
      topCategoryId: topId,
      level: getNodeLevel(id),
      children: children.length ? children : undefined,
    };
  };

  const rows = topCats.map((tc) => buildCategory(tc, tc)).sort((a, b) => a.label.localeCompare(b.label));
  return rows;
}

export function buildPermissionTree(nodes: Node[], edges: Edge[]) {
  const rows = graphToTableRows(nodes, edges);

  const byId = new Map<string, PermissionTableRow>();
  const childrenById = new Map<string, string[]>();
  const parentById = new Map<string, string>();
  const topKeys = rows.map((r) => r.key);

  const walk = (r: PermissionTableRow) => {
    byId.set(r.key, r);
    if (r.children?.length) {
      childrenById.set(
        r.key,
        r.children.map((c) => c.key),
      );
      for (const c of r.children) {
        parentById.set(c.key, r.key);
        walk(c);
      }
    }
  };
  rows.forEach(walk);

  const findDescendants = (catId: string) => {
    const q = [catId];
    const cats: string[] = [];
    const leafs: string[] = [];
    while (q.length) {
      const cur = q.pop()!;
      const kids = childrenById.get(cur) ?? [];
      for (const k of kids) {
        const n = byId.get(k)!;
        if (n.kind === 'category') {
          cats.push(n.key);
          q.push(n.key);
        } else if (n.kind === 'leaf') {
          leafs.push(n.key);
        }
      }
    }
    return { cats, leafs };
  };

  return { rows, byId, childrenById, parentById, topKeys, findDescendants };
}

export function permissionsFromChecked(
  checkedByCol: {
    high: { parent: Record<string, boolean>; leaf: Record<string, boolean> };
    detail: { parent: Record<string, boolean>; leaf: Record<string, boolean> };
    none: { parent: Record<string, boolean>; leaf: Record<string, boolean> };
  },
  childrenById: Map<string, string[]>,
  topKeys: string[],
): Permission[] {
  const out: Permission[] = [];

  type Perm = 'DETAILED' | 'HIGH_LEVEL' | 'NONE';

  const explicit = new Map<string, Perm>();

  for (const [id, checked] of Object.entries(checkedByCol.detail.parent)) {
    if (checked) explicit.set(id, 'DETAILED');
  }
  for (const [id, checked] of Object.entries(checkedByCol.detail.leaf)) {
    if (checked) explicit.set(id, 'DETAILED');
  }

  for (const [id, checked] of Object.entries(checkedByCol.high.parent)) {
    if (checked && !explicit.has(id)) explicit.set(id, 'HIGH_LEVEL');
  }
  for (const [id, checked] of Object.entries(checkedByCol.high.leaf)) {
    if (checked && !explicit.has(id)) explicit.set(id, 'HIGH_LEVEL');
  }

  for (const [id, checked] of Object.entries(checkedByCol.none.parent)) {
    if (checked) explicit.set(id, 'NONE');
  }
  for (const [id, checked] of Object.entries(checkedByCol.none.leaf)) {
    if (checked) explicit.set(id, 'NONE');
  }

  const visit = (id: string, inherited: Perm | null, isTop: boolean) => {
    const own = explicit.get(id);
    const effective: Perm = own ?? inherited ?? 'NONE';

    const inheritedOrDefault: Perm = inherited ?? 'NONE';
    const shouldEmit = isTop || effective !== inheritedOrDefault;

    if (shouldEmit) {
      out.push({ id, permission: effective });
    }

    const kids = childrenById.get(id) ?? [];
    for (const k of kids) {
      visit(k, effective, false);
    }
  };

  for (const topId of topKeys) {
    visit(topId, null, true);
  }

  return out;
}

export function permissionsToCheckedByCol(permissions: Permission[], nodes: Node[], edges: Edge[]) {
  const rows = graphToTableRows(nodes, edges);

  const byId = new Map<string, PermissionTableRow>();
  const childrenById = new Map<string, string[]>();
  const parentById = new Map<string, string>();
  const topKeys = rows.map((r) => r.key);

  const walkBuild = (r: PermissionTableRow) => {
    byId.set(r.key, r);
    if (r.children?.length) {
      const kids = r.children.map((c) => c.key);
      childrenById.set(r.key, kids);
      for (const c of r.children) {
        parentById.set(c.key, r.key);
        walkBuild(c);
      }
    }
  };
  rows.forEach(walkBuild);

  const normalize = (p?: string) => p as PermissionType;
  const pMap = new Map<string, PermissionType | undefined>();
  for (const p of permissions) pMap.set(p.id, normalize(p.permission));

  const checkedByCol = {
    high: { parent: {} as Record<string, boolean>, leaf: {} as Record<string, boolean> },
    detail: { parent: {} as Record<string, boolean>, leaf: {} as Record<string, boolean> },
    none: { parent: {} as Record<string, boolean>, leaf: {} as Record<string, boolean> },
  };

  const setChecked = (perm: PermissionType, id: string) => {
    const row = byId.get(id);
    if (!row) return;

    if (perm === 'NONE') {
      const bucket = row.kind === 'category' ? 'parent' : 'leaf';
      checkedByCol.none[bucket][id] = true;
      return;
    }

    const col = perm === 'DETAILED' ? 'detail' : 'high';
    const bucket = row.kind === 'category' ? 'parent' : 'leaf';
    checkedByCol[col][bucket][id] = true;
  };

  type EffPerm = PermissionType;

  const dfs = (id: string, inherited: EffPerm | null) => {
    const own = pMap.get(id);
    const effective: EffPerm = own !== undefined ? own : (inherited ?? 'NONE');

    if (effective === 'NONE') {
      if (own === 'NONE' || (inherited && inherited !== 'NONE')) {
        setChecked('NONE', id);
      }
    } else {
      setChecked(effective, id);
    }

    const kids = childrenById.get(id) ?? [];
    for (const k of kids) {
      dfs(k, effective);
    }
  };

  for (const topId of topKeys) {
    dfs(topId, null);
  }

  return { checkedByCol };
}

// i didnt know where else to put this
// ps: this code was not written by me, its from the SWE FYP project
// -Vincent
export const transformNodes = (nodes: GraphNodePayload[], edges: GraphEdgePayload[]): Node[] => {
  const PARENT_RADIUS = 350;
  const CHILD_RADIUS = 250;
  const ARC_SPAN = Math.PI / 3; // 60 degree arc

  // Group nodes by depth
  const nodesByDepth = nodes.reduce(
    (acc, node) => {
      if (!acc[node.depth]) acc[node.depth] = [];
      acc[node.depth].push(node);
      return acc;
    },
    {} as Record<number, GraphNodePayload[]>,
  );

  // Edge format: parent→child (source is parent, target is child)
  // Detect orphan nodes and assign them to Uncategorised
  const edgesWithOrphans = [...edges];
  const uncategorisedNode = nodes.find(
    (node) => node.label.toLowerCase().includes('uncategorised') || node.label.toLowerCase().includes('uncategorized'),
  );

  console.log('edges with orphans:', edgesWithOrphans);

  if (uncategorisedNode) {
    // Find nodes at depth 1+ that don't have a parent edge
    nodes.forEach((node) => {
      if (node.depth > 0) {
        const hasParent = edges.some((edge) => edge.target === node.id);
        if (!hasParent) {
          // Add synthetic edge from Uncategorised parent to this orphan child
          edgesWithOrphans.push({
            source: uncategorisedNode.id,
            target: node.id,
          });
        }
      }
    });
  }

  // Store calculated positions for lookup
  const positions = new Map<string, { x: number; y: number; angle: number }>();

  // Sort nodes by depth to ensure parents are processed before children
  const sortedNodes = [...nodes].sort((a, b) => a.depth - b.depth);

  return sortedNodes.map((node) => {
    let x = 0,
      y = 0;

    if (node.depth === 0) {
      // Root node at center
      x = 0;
      y = 0;
      positions.set(node.id, { x, y, angle: 0 });
    } else if (node.depth === 1) {
      // First level: arrange in a circle around the center
      const nodesAtDepth = nodesByDepth[1];
      const indexAtDepth = nodesAtDepth.indexOf(node);
      const totalNodesAtDepth = nodesAtDepth.length;

      const angleStep = (2 * Math.PI) / totalNodesAtDepth;
      const angle = indexAtDepth * angleStep;

      x = PARENT_RADIUS * Math.cos(angle);
      y = PARENT_RADIUS * Math.sin(angle);
      positions.set(node.id, { x, y, angle });
    } else {
      // Deeper levels: group children around their parent
      const parentEdge = edgesWithOrphans.find((edge) => edge.target === node.id);
      const parentNode = nodes.find((n) => n.id === parentEdge?.source);

      if (parentNode) {
        // Get parent position from the cache
        const parentPos = positions.get(parentNode.id);

        if (parentPos) {
          const parentX = parentPos.x;
          const parentY = parentPos.y;
          const parentAngle = parentPos.angle;

          // Get siblings (other children of the same parent)
          const siblings = edgesWithOrphans.filter((edge) => edge.source === parentNode.id).map((edge) => edge.target);

          const siblingIndex = siblings.indexOf(node.id);
          const totalSiblings = siblings.length;

          if (totalSiblings === 1) {
            // Only child - place directly outward from parent
            x = parentX + CHILD_RADIUS * Math.cos(parentAngle);
            y = parentY + CHILD_RADIUS * Math.sin(parentAngle);
          } else {
            // Multiple children - arrange in arc around parent
            const startAngle = parentAngle - ARC_SPAN / 2;
            const angleStep = ARC_SPAN / (totalSiblings - 1);
            const childAngle = startAngle + siblingIndex * angleStep;

            x = parentX + CHILD_RADIUS * Math.cos(childAngle);
            y = parentY + CHILD_RADIUS * Math.sin(childAngle);
          }

          positions.set(node.id, { x, y, angle: parentAngle });
        }
      } else {
        console.log('node depth:', node.depth);
        console.log('');
      }
    }

    return {
      id: node.id,
      type: node.depth === 0 ? 'root' : 'category',
      position: { x, y },
      data: {
        label: node.label,
        level: node.depth,
      },
    };
  });
};

export const transformEdges = (nodes: GraphNodePayload[], edges: GraphEdgePayload[]): Edge[] => {
  // Edge format: parent→child (source is parent, target is child)
  // Find uncategorised node for orphan detection
  const uncategorisedNode = nodes.find(
    (node) => node.label.toLowerCase().includes('uncategorised') || node.label.toLowerCase().includes('uncategorized'),
  );

  // Build edge list with orphan detection
  const edgesWithOrphans = [...edges];
  const syntheticEdgeIds = new Set<string>();

  if (uncategorisedNode) {
    nodes.forEach((node) => {
      if (node.depth > 0) {
        const hasParent = edges.some((edge) => edge.target === node.id);
        if (!hasParent) {
          const syntheticEdge = {
            source: uncategorisedNode.id,
            target: node.id,
          };
          edgesWithOrphans.push(syntheticEdge);
          syntheticEdgeIds.add(`${syntheticEdge.source}-${syntheticEdge.target}`);
        }
      }
    });
  }

  return edgesWithOrphans.map((edge, index) => {
    const isSynthetic = syntheticEdgeIds.has(`${edge.source}-${edge.target}`);
    return {
      id: `edge-${edge.source}-${edge.target}-${index}`,
      source: edge.source,
      target: edge.target,
      type: 'floating',
      animated: false,
      deletable: true,
      selectable: true,
      focusable: true,
      data: {
        isOriginal: !isSynthetic,
        isSynthetic,
      },
    };
  });
};

export function autoGenerateColumnsForLeafs(nodes: Node[], edges: Edge[]): { newNodes: Node[]; newEdges: Edge[] } {
  const COLUMN_RADIUS = 250;
  const byId = new Map(nodes.map((n) => [n.id, n]));

  // get incoming edges so we can calculate the angle from parent to grandparent
  const incomingMap = new Map<string, string>();
  edges.forEach((e) => {
    incomingMap.set(e.target, e.source);
  });

  // outgoing edges to check for children (since column nodes are only for nodes without chlidren)
  const outMap = new Map<string, Edge[]>();
  edges.forEach((e) => {
    const list = outMap.get(e.source) || [];
    list.push(e);
    outMap.set(e.source, list);
  });

  const newNodes = [...nodes];
  const newEdges = [...edges];

  nodes.forEach((node) => {
    if (node.type !== 'category') return;

    const outgoing = outMap.get(node.id) || [];
    const hasChildCategory = outgoing.some((e) => byId.get(e.target)?.type === 'category');

    if (!hasChildCategory) {
      const label = node.data.label;
      const id = node.id;
      const columnId = `col-${label}-${node.id}`;

      const hasColumnAlready = outgoing.some((e) => byId.get(e.target)?.type === 'column');
      if (hasColumnAlready) return;

      // calculate position based on the angle of parent to grandparent node (from column node perspective)
      let x = node.position.x;
      let y = node.position.y + 200; // fallback default

      const parentId = incomingMap.get(node.id);
      const parentNode = parentId ? byId.get(parentId) : undefined;

      if (parentNode) {
        const dx = node.position.x - parentNode.position.x;
        const dy = node.position.y - parentNode.position.y;

        // checks if parent and grandparent node are in the same position in case something messed up
        if (dx !== 0 || dy !== 0) {
          const angle = Math.atan2(dy, dx);
          x = node.position.x + COLUMN_RADIUS * Math.cos(angle);
          y = node.position.y + COLUMN_RADIUS * Math.sin(angle);
        }
      }

      // create the column node
      const columnNode: Node = {
        id: columnId,
        type: 'column',
        position: { x, y },
        data: {
          label: id,
          level: ((node.data as NodeData).level || 0) + 1,
        },
      };

      // creates the connecting edge
      const edge: Edge = {
        id: `edge-${node.id}-${columnId}`,
        source: node.id,
        target: columnId,
        type: 'smoothstep', // lowkey looks nicer than 'default'
      };

      newNodes.push(columnNode);
      newEdges.push(edge);
    }
  });

  return { newNodes, newEdges };
}
