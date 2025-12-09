import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ColumnMappingStep } from './ColumnMappingStep';
import { ColumnInfo } from '@app/api/database.api';
import { Node, Edge } from '@xyflow/react';
import { Anchor } from '@app/components/reactflow-components/ColumnToolbar/ReactflowBridge/ReactflowBridge';

vi.mock('@app/components/reactflow-components/ArchetypeFlow/ArchetypeFlow', () => ({
  ArchetypeFlow: ({ onAnchorChange }: { onAnchorChange: (a: Anchor) => void }) => (
    <div>
      <button
        data-testid="select-node-A"
        onClick={() =>
          onAnchorChange({
            selectedId: 'A',
            left: 100,
            top: 100,
            flowPos: { x: 0, y: 0 },
          })
        }
      >
        Select node A
      </button>
    </div>
  ),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

const mockColumnToolbar = vi.fn();
vi.mock('@app/components/reactflow-components/ColumnToolbar/ColumnToolbar', () => ({
  ColumnToolbar: (props: { columns: ColumnInfo[] }) => {
    mockColumnToolbar(props);
    return (
      <div data-testid="column-toolbar">
        {props.columns.map((c: ColumnInfo) => (
          <div key={c.id}>{c.name}</div>
        ))}
      </div>
    );
  },
}));

describe('ColumnMappingStep', () => {
  it('only show columns that does not exist as column nodes in the archetype', async () => {
    const user = userEvent.setup();

    const nodes: Node[] = [
      {
        id: 'root',
        type: 'root',
        data: { label: 'Root', level: 0 },
        position: { x: 0, y: 0 },
      },
      {
        id: 'A',
        type: 'category',
        data: { label: 'A', level: 1 },
        position: { x: 0, y: 100 },
      },
      {
        id: 'col-1',
        type: 'column',
        data: { label: 'Existing Col', table: 't1', level: 2 },
        position: { x: 100, y: 100 },
      },
    ];

    const edges: Edge[] = [
      { id: 'e1', source: 'root', target: 'A' },
      { id: 'e2', source: 'A', target: 'col-1' },
    ];

    const columns: ColumnInfo[] = [
      { id: 'col-1', name: 'Existing Col', table: 't1' },
      { id: 'col-2', name: 'New Col', table: 't2' },
    ];

    const setNodes = vi.fn();
    const setEdges = vi.fn();
    const setColumns = vi.fn();
    const onNodesChange = vi.fn();
    const onEdgesChange = vi.fn();
    const onNodesDeleted = vi.fn();

    render(
      <ColumnMappingStep
        name="Test Archetype"
        nodes={nodes}
        edges={edges}
        setNodes={setNodes}
        setEdges={setEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        columns={columns}
        setColumns={setColumns}
        onNodesDeleted={onNodesDeleted}
      />,
    );

    await user.click(screen.getByTestId('select-node-A'));

    expect(await screen.findByTestId('column-toolbar')).toBeInTheDocument();

    const lastCall = mockColumnToolbar.mock.calls[mockColumnToolbar.mock.calls.length - 1];
    const toolbarProps = lastCall[0] as { columns: ColumnInfo[] };

    expect(toolbarProps.columns.map((c) => c.name)).toEqual(['New Col']);
  });
});
