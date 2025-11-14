import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { MultiStepArchetypeModal } from '@app/components/database-mapping/modal/MultiStepArchetypeModal';
import { ModalStepHeaderProps } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { createArchetype } from '@app/api/archetypes.api';
import { ColumnInfo } from '@app/api/database.api';
import { CreateTemplateStepProps } from './steps/CreateTemplateStep';
import { SetPermissionsStepProps } from './steps/SetPermissionsStep';

vi.mock('@app/components/common/Modal/ModalHeaders/ModalHeaders', () => ({
  ModalStepHeader: ({ handleDraft }: ModalStepHeaderProps) => (
    <div data-testid="modal-step-header">
      <button onClick={handleDraft}>Save Draft</button>
    </div>
  ),
}));

vi.mock('@app/components/database-mapping/modal/steps/ArchetypeNameStep', () => ({
  ArchetypeNameStep: () => <div>Step: Name</div>,
}));
vi.mock('@app/components/database-mapping/modal/steps/CreateTemplateStep', () => ({
  CreateTemplateStep: (props: CreateTemplateStepProps) => (
    <div>
      Step: Create
      <button data-testid="simulate-delete-A" onClick={() => props.onNodesDeleted?.(new Set(['A']))}>
        simulate delete A
      </button>
    </div>
  ),
}));
vi.mock('@app/components/database-mapping/modal/steps/ColumnMappingStep', () => ({
  ColumnMappingStep: () => <div>Step: Map</div>,
}));
vi.mock('@app/components/database-mapping/modal/steps/SetPermissionsStep', () => ({
  SetPermissionsStep: ({ checkedByCol }: SetPermissionsStepProps) => (
    <div>
      Step: Permissions
      <pre data-testid="checked-by-col">{JSON.stringify(checkedByCol)}</pre>
    </div>
  ),
}));

vi.mock('@app/api/archetypes.api', () => ({
  createArchetype: vi.fn(),
  updateArchetype: vi.fn(),
}));

vi.mock('@app/utils/reactflow/helpers', () => ({
  findDuplicateChildLabels: () => [],
  findUnmappedLeafs: () => [],
  permissionsFromChecked: () => [],
  permissionsToCheckedByCol: () => ({
    checkedByCol: { high: { parent: {}, leaf: {} }, detail: { parent: {}, leaf: {} } },
    modeByTop: {},
  }),
}));

const mockSetModalStep = vi.fn();
const mockSetIsModalOpen = vi.fn();
const mockHandleDraft = vi.fn();
const mockFetchArchetypes = vi.fn();
const mockFetchColumns = vi.fn();
const mockSetColumns = vi.fn();
const mockColumns: ColumnInfo[] = [];

const mockForms = [
  {
    getFieldValue: vi.fn(),
    validateFields: vi.fn(),
    resetFields: vi.fn(),
    setFieldsValue: vi.fn(),
  },
];

let modalStepState = 0;

vi.mock('@app/hooks/useArchetypeModalContext', () => ({
  useArchetypeModalContext: () => ({
    modalStep: modalStepState,
    setModalStep: mockSetModalStep,
    setIsModalOpen: mockSetIsModalOpen,
    isModalOpen: true,
    handleDraft: mockHandleDraft,
    forms: mockForms,
    fetchColumns: mockFetchColumns,
    columns: mockColumns,
    setColumns: mockSetColumns,
  }),
}));

vi.mock('@app/utils/reactflow/helpers', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as Record<string, unknown>),
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (k: string) => k }),
}));

const renderModal = (props?: Partial<React.ComponentProps<typeof MultiStepArchetypeModal>>) =>
  render(
    <MultiStepArchetypeModal fetchArchetypes={vi.fn()} projectId="P1" mask closable={false} width="60%" {...props} />,
  );

describe('MultiStepArchetypeModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const defaultProps = {
    fetchArchetypes: mockFetchArchetypes,
  };

  it('renders modal when open', () => {
    render(<MultiStepArchetypeModal projectId={'P1'} {...defaultProps} />);

    expect(screen.getByText('Step: Name')).toBeInTheDocument();
    expect(screen.getByTestId('modal-step-header')).toBeInTheDocument();
  });

  it('invalid name blocks next on step 0', async () => {
    modalStepState = 0;

    mockForms[0].validateFields.mockRejectedValueOnce(new Error('invalid'));

    renderModal();

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /common.next/i }));

    expect(mockSetModalStep).not.toHaveBeenCalled();
  });

  it('submit creates ACTIVE archetype when creating on final step', async () => {
    modalStepState = 3;

    mockForms[0].getFieldValue.mockReturnValue('Valid Name');

    renderModal({ archetype: undefined });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /project.createTemplate.form.submit/i }));

    const mockedCreate = vi.mocked(createArchetype);

    await waitFor(() => {
      expect(mockedCreate).toHaveBeenCalledTimes(1);
      const [payload] = mockedCreate.mock.calls[0];
      expect(payload.status).toBe('ACTIVE');
      expect(payload.projectId).toBe('P1');
      expect(payload.name).toBe('Valid Name');
    });
  });

  it('Save Draft invokes handleDraft (status DRAFT built internally)', async () => {
    modalStepState = 1;

    renderModal();

    const user = userEvent.setup();
    await user.click(screen.getByText(/save draft/i));

    expect(mockHandleDraft).toHaveBeenCalledTimes(1);
  });

  it('clears permission entries immediately when nodes are deleted', async () => {
    modalStepState = 1;

    const archetype = {
      projectId: 'P1',
      archetypeId: 'A1',
      name: 'Archetype X',
      status: 'DRAFT' as const,
      nodes: [
        { id: 'root', type: 'root', position: { x: 0, y: 0 }, data: { label: 'Main', level: 0 }, deletable: false },
        { id: 'A', type: 'category', position: { x: 0, y: 0 }, data: { label: 'A', level: 1 } },
        { id: 'C', type: 'column', position: { x: 0, y: 0 }, data: { label: 'Col C', table: 't', level: 2 } },
      ],
      edges: [
        { id: 'e1', source: 'root', target: 'A' },
        { id: 'e2', source: 'A', target: 'C' },
      ],
      permissions: [{ id: 'A', permission: 'HIGH_LEVEL' as const }],
    };

    const { rerender } = renderModal({ archetype });

    expect(screen.getByText('Step: Create')).toBeInTheDocument();

    await userEvent.click(screen.getByTestId('simulate-delete-A'));

    modalStepState = 3;
    rerender(<MultiStepArchetypeModal fetchArchetypes={vi.fn()} projectId="P1" mask closable={false} width="60%" />);

    const json = screen.getByTestId('checked-by-col').textContent || '{}';
    const checked = JSON.parse(json);

    expect(checked?.high?.parent?.A).toBeUndefined();
    expect(checked?.high?.leaf?.A).toBeUndefined();
    expect(checked?.detail?.parent?.A).toBeUndefined();
    expect(checked?.detail?.leaf?.A).toBeUndefined();
  });
});
