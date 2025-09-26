import { FlowMode } from '@app/context/ArchetypeFlow';
import React, { useMemo, useState, useCallback } from 'react';
import { Panel, addEdge, Edge, Node } from 'reactflow';

type Props = {
  selectedSubcat: Node | null;
  setNodes: React.Dispatch<React.SetStateAction<Node[]>>;
  setEdges: React.Dispatch<React.SetStateAction<Edge[]>>;
  mode: FlowMode;
  columns: string[];
  setColumns?: React.Dispatch<React.SetStateAction<string[]>>;
};

export const ColumnSidebar: React.FC<Props> = ({ selectedSubcat, setNodes, setEdges, mode, columns, setColumns }) => {
  const [q, setQ] = useState('');
  const isActive = mode === 'mapping' && !!selectedSubcat;
  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return s ? columns.filter((c) => c.toLowerCase().includes(s)) : columns;
  }, [columns, q]);

  const newNodeId = () =>
    typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `node_${Date.now()}_${Math.floor(Math.random() * 1e6)}`;

  const handlePick = useCallback(
    (name: string) => {
      if (!selectedSubcat) return;

      const baseX = selectedSubcat.position?.x ?? 0;
      const baseY = selectedSubcat.position?.y ?? 0;
      const colId = `column_${newNodeId()}`;

      setNodes((nds) =>
        nds.concat({
          id: colId,
          type: 'column',
          position: { x: baseX + 260, y: baseY },
          data: { label: name },
        } as Node),
      );

      setEdges((eds) =>
        addEdge(
          { id: `e_${selectedSubcat.id}_${colId}`, source: selectedSubcat.id, target: colId, type: 'default' },
          eds,
        ),
      );

      setColumns?.((prev) => prev.filter((c) => c !== name));
    },
    [selectedSubcat, setNodes, setEdges, setColumns],
  );

  if (!isActive) return null;

  return (
    <Panel position="top-right">
      <div
        className="w-64 rounded-lg border border-gray-300 bg-white shadow-md p-2"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-sm font-medium mb-2">Map a column</div>

        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search columns…"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-blue-500"
        />

        <div className="mt-2 max-h-64 overflow-y-auto">
          {filtered.length ? (
            filtered.map((name) => (
              <button
                key={name}
                onClick={() => handlePick(name)}
                className="mt-2 w-full text-left rounded-md border border-sky-300 hover:bg-sky-50"
              >
                <div className="mx-3 py-1 flex items-center justify-between border-x border-sky-300">
                  <span className="block py-1 px-1 text-xs">{name}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="px-2 py-1 text-xs text-gray-500">No results</div>
          )}
        </div>
      </div>
    </Panel>
  );
};
