import { render, screen, within, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DatabaseMappingHeader } from '@app/components/database-mapping/DatabaseMappingHeader';
import type { Archetype, ArchetypeInfo } from '@app/api/archetypes.api';
import { updateArchetypeDetails, deleteArchetype } from '@app/api/archetypes.api';

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
        'project.main.dbMapping.table.manage.publish.description':
          "Publish this template as your project's public archetype?",
        'project.main.dbMapping.table.manage.withdraw.title': 'Withdraw Archetype',
        'project.main.dbMapping.table.manage.withdraw.description':
          "Withdraw this template as your project's public archetype?",
        'project.main.dbMapping.table.manage.delete.title': 'Delete Archetype',
        'project.main.dbMapping.table.manage.delete.description': 'Are you sure you want to delete this template?',
        'project.main.dbMapping.table.manage.publish.success': 'Archetype published successfully',
        'project.main.dbMapping.table.manage.publish.failed': 'Failed to publish archetype',
        'project.main.dbMapping.table.manage.withdraw.success': 'Archetype withdrawn successfully',
        'project.main.dbMapping.table.manage.withdraw.failed': 'Failed to withdraw archetype',
        'project.main.dbMapping.table.manage.delete.success': 'Archetype deleted successfully',
        'project.main.dbMapping.table.manage.delete.failed': 'Failed to delete archetype',
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

const renderHeader = (opts: {
  status: 'DRAFT' | 'ACTIVE' | 'PUBLISHED';
  projectId?: string;
  archetypes?: Archetype[];
}) => {
  const archetype = {
    archetypeId: 'A1',
    projectId: opts.projectId ?? 'P1',
    name: 'My Archetype',
    lastModified: new Date(),
    created: new Date(),
    createdBy: 'user-123',
    status: opts.status,
  } as unknown as ArchetypeInfo;

  render(
    <DatabaseMappingHeader projectId={opts.projectId ?? 'P1'} archetype={archetype} archetypes={opts.archetypes} />,
  );

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

  it('Publishing flips existing PUBLISHED to ACTIVE first, then publishes current', async () => {
    const existingPublished = { id: 'A2', status: 'PUBLISHED', name: 'Old' } as Archetype;

    renderHeader({
      status: 'ACTIVE',
      archetypes: [existingPublished],
    });

    const user = userEvent.setup();
    await user.click(screen.getByRole('button', { name: /publish/i }));
    await user.click(within(document.body).getByRole('button', { name: /yes/i }));

    await waitFor(() => {
      expect(updateArchetypeDetails).toHaveBeenNthCalledWith(1, 'P1', 'A2', { status: 'ACTIVE' });
      expect(updateArchetypeDetails).toHaveBeenNthCalledWith(2, 'P1', 'A1', { status: 'PUBLISHED' });
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
