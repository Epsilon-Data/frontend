import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { faker } from '@faker-js/faker';

import { Projects } from './Projects';
import type { ProjectSummaryInfo } from '@app/api/projects.api';

const mockShowModal = vi.fn();

vi.mock('@app/hooks/useBrowseModalContext', () => ({
  useBrowseModalContext: () => ({
    showModal: mockShowModal,
  }),
}));

// Mock ProjectList
vi.mock('@app/components/ProjectList/ProjectList', () => ({
  ProjectList: ({
    projects,
    mode,
    layout,
    onProjectClick,
  }: {
    projects: ProjectSummaryInfo[];
    mode: 'dashboard' | 'all';
    layout: 'list' | 'grid';
    onProjectClick: (projectId: string) => void;
  }) => (
    <div data-testid="project-list">
      <span data-testid="mode">{mode}</span>
      <span data-testid="layout">{layout}</span>
      <span data-testid="project-count">{projects?.length ?? 0}</span>
      {projects?.map((project) => (
        <button
          key={project.projectId}
          data-testid={`project-${project.projectId}`}
          onClick={() => onProjectClick(project.projectId)}
        >
          {project.name}
        </button>
      ))}
    </div>
  ),
}));

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({
    matches: false,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  })),
});

const generateMockProjects = (count: number): ProjectSummaryInfo[] =>
  Array.from({ length: count }).map(() => ({
    projectId: faker.string.uuid(),
    name: faker.company.name(),
    lastModified: faker.date.anytime(),
    createdDate: faker.date.anytime(),
    university: faker.string.alpha(10),
    faculty: faker.string.alpha(20),
    lead: faker.person.fullName(),
    status: faker.string.alpha(10),
  }));

describe('Browse Hub - Projects Component', () => {
  const projects = generateMockProjects(3);

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders ProjectList with mode="all" and provided layout', () => {
    render(<Projects projects={projects} layout="grid" loading={false} />);

    expect(screen.getByTestId('project-list')).toBeInTheDocument();
    expect(screen.getByTestId('mode')).toHaveTextContent('all');
    expect(screen.getByTestId('layout')).toHaveTextContent('grid');
    expect(screen.getByTestId('project-count')).toHaveTextContent(String(projects.length));
  });

  it('wraps ProjectList with the expected CSS class', () => {
    render(<Projects projects={projects} layout="list" loading={false} />);

    const wrapper = screen.getByTestId('project-list').parentElement;
    expect(wrapper).toHaveClass('my-2');
  });

  it('invokes showModal with the clicked projectId', async () => {
    const user = userEvent.setup();
    render(<Projects projects={projects} layout="grid" loading={false} />);

    const target = projects[1];
    await user.click(screen.getByTestId(`project-${target.projectId}`));

    expect(mockShowModal).toHaveBeenCalledTimes(1);
    expect(mockShowModal).toHaveBeenCalledWith(target.projectId);
  });
});
