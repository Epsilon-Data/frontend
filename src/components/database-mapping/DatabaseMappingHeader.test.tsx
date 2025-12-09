import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, beforeAll } from 'vitest';
import { DatabaseMappingHeader } from '@app/components/database-mapping/DatabaseMappingHeader';
import type { ArchetypeInfo } from '@app/api/archetypes.api';
import { updateArchetypeDetails, deleteArchetype } from '@app/api/archetypes.api';

beforeAll(() => {
  global.ResizeObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
});

const mockNavigate = vi.fn();

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('@app/hooks/useArchetypeModalContext', () => ({
  useArchetypeModalContext: () => ({
    mode: 'edit',
    showModal: vi.fn(),
  }),
}));

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (k: string) => {
      const map: Record<string, string> = {
        'common.delete': 'Delete',
        'common.publish': 'Publish',
        'common.withdraw': 'Withdraw',
        'project.main.dbMapping.table.manage.continueEdit': 'Continue editing',
        'project.main.dbMapping.table.manage.edit': 'Edit template',
        'project.main.dbMapping.table.manage.publish.title': 'Publish Archetype',
        'project.main.dbMapping.table.manage.withdraw.title': 'Withdraw Archetype',
        'project.main.dbMapping.table.manage.delete.title': 'Delete Archetype',
      };
      return map[k] ?? k;
    },
  }),
}));

// Mock API
vi.mock('@app/api/archetypes.api', () => ({
  updateArchetypeDetails: vi.fn(),
  deleteArchetype: vi.fn(),
}));

const renderHeader = (opts: { status: 'DRAFT' | 'ACTIVE' | 'PUBLISHED'; projectId?: string }) => {
  const archetype = {
    archetypeId: 'A1',
    projectId: opts.projectId ?? 'P1',
    name: 'My Archetype',
    lastModified: new Date(),
    created: new Date(),
    createdBy: 'user-123',
    status: opts.status,
  } as unknown as ArchetypeInfo;

  render(<DatabaseMappingHeader projectId={opts.projectId ?? 'P1'} archetype={archetype} />);

  return { archetype };
};

describe('DatabaseMappingHeader component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('DRAFT: Delete + Continue editing', () => {
    renderHeader({ status: 'DRAFT' });

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /continue editing/i })).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /publish/i })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /withdraw/i })).not.toBeInTheDocument();
  });

  it('ACTIVE: Delete + Edit template + Publish', () => {
    renderHeader({ status: 'ACTIVE' });

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit template/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /publish/i })).toBeInTheDocument();
  });

  it('PUBLISHED: Delete + Edit template + Withdraw', () => {
    renderHeader({ status: 'PUBLISHED' });

    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /edit template/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /withdraw/i })).toBeInTheDocument();
  });

  it('Publish flow (ACTIVE to PUBLISHED) confirms and updates status', async () => {
    renderHeader({ status: 'ACTIVE' });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /publish/i }));

    expect(await screen.findByText(/publish archetype/i)).toBeInTheDocument();
    await user.click(within(document.body).getByRole('button', { name: /yes/i }));

    await waitFor(() => {
      expect(updateArchetypeDetails).toHaveBeenCalledTimes(1);
      expect(updateArchetypeDetails).toHaveBeenCalledWith('P1', 'A1', { status: 'PUBLISHED' });
    });
  });

  it('Withdraw flow (PUBLISHED to ACTIVE) confirms and updates status', async () => {
    renderHeader({ status: 'PUBLISHED' });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /withdraw/i }));
    expect(await screen.findByText(/withdraw archetype/i)).toBeInTheDocument();
    await user.click(within(document.body).getByRole('button', { name: /yes/i }));

    await waitFor(() => {
      expect(updateArchetypeDetails).toHaveBeenCalledTimes(1);
      expect(updateArchetypeDetails).toHaveBeenCalledWith('P1', 'A1', { status: 'ACTIVE' });
    });
  });

  it('Delete flow confirms and calls API', async () => {
    renderHeader({ status: 'ACTIVE' });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /delete/i }));
    expect(await screen.findByText(/delete archetype/i)).toBeInTheDocument();
    await user.click(within(document.body).getByRole('button', { name: /yes/i }));

    await waitFor(() => {
      expect(deleteArchetype).toHaveBeenCalledTimes(1);
      expect(deleteArchetype).toHaveBeenCalledWith('P1', 'A1');
    });
  });
});
