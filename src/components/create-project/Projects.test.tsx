import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Projects } from './Projects';
import { faker } from '@faker-js/faker';
import { ProjectSummaryInfo } from '@app/api/projects.api';

const mockNavigate = vi.fn();
const mockT = vi.fn((key: string) => key);

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(() => ({})),
});

// Mock the ProjectList component
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
      <span data-testid="project-count">{projects.length}</span>
      <span data-testid="mode">{mode}</span>
      <span data-testid="layout">{layout}</span>
      <div data-testid="project-names">{projects.map((p) => p.name).join('|')}</div>

      {projects.map((project) => (
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

const generateMockProjects = (count: number) => {
  const mockProjectList: ProjectSummaryInfo[] = [];
  for (let i = 0; i < count; i++) {
    mockProjectList.push({
      projectId: faker.string.uuid(),
      name: faker.company.name(),
      lastModified: faker.date.anytime(),
      createdDate: faker.date.anytime(),
      university: faker.string.alpha(10),
      faculty: faker.string.alpha(20),
      lead: faker.person.fullName(),
      status: faker.string.alpha(10),
    });
  }
  return mockProjectList;
};

const TestWrapper = ({ children }: { children: React.ReactNode }) => <BrowserRouter>{children}</BrowserRouter>;

const defaultPagination = { page: 1, limit: 12, total: 0, totalPages: 0 };
const noop = () => {};

describe('Projects Component', () => {
  const mockOwnedProjects = generateMockProjects(2);
  const mockSharedProjects = generateMockProjects(2);

  beforeEach(() => {
    vi.clearAllMocks();
    mockT.mockImplementation((key: string) => key);
  });

  it('renders successfully when provided mock projects (default sections)', () => {
    render(
      <TestWrapper>
        <Projects
          ownedProjects={mockOwnedProjects}
          sharedProjects={mockSharedProjects}
          ownedPagination={{ ...defaultPagination, total: 2, totalPages: 1 }}
          sharedPagination={{ ...defaultPagination, total: 2, totalPages: 1 }}
          layout="grid"
          searchValue=""
          loading={false}
          onOwnedPageChange={noop}
          onSharedPageChange={noop}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('dashboard.main.personalProjects.title')).toBeInTheDocument();
    expect(screen.getByText('dashboard.main.sharedProjects.title')).toBeInTheDocument();
  });

  it('displays personal projects section with correct title and description', () => {
    render(
      <TestWrapper>
        <Projects
          ownedProjects={mockOwnedProjects}
          sharedProjects={mockSharedProjects}
          ownedPagination={{ ...defaultPagination, total: 2, totalPages: 1 }}
          sharedPagination={{ ...defaultPagination, total: 2, totalPages: 1 }}
          layout="grid"
          searchValue=""
          loading={false}
          onOwnedPageChange={noop}
          onSharedPageChange={noop}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('dashboard.main.personalProjects.title')).toBeInTheDocument();
    expect(screen.getByText('dashboard.main.personalProjects.description')).toBeInTheDocument();
  });

  it('displays shared projects section with correct title and description', () => {
    render(
      <TestWrapper>
        <Projects
          ownedProjects={mockOwnedProjects}
          sharedProjects={mockSharedProjects}
          ownedPagination={{ ...defaultPagination, total: 2, totalPages: 1 }}
          sharedPagination={{ ...defaultPagination, total: 2, totalPages: 1 }}
          layout="grid"
          searchValue=""
          loading={false}
          onOwnedPageChange={noop}
          onSharedPageChange={noop}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('dashboard.main.sharedProjects.title')).toBeInTheDocument();
    expect(screen.getByText('dashboard.main.sharedProjects.description')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(
      <TestWrapper>
        <Projects
          ownedProjects={mockOwnedProjects}
          sharedProjects={mockSharedProjects}
          ownedPagination={{ ...defaultPagination, total: 2, totalPages: 1 }}
          sharedPagination={{ ...defaultPagination, total: 2, totalPages: 1 }}
          layout="grid"
          searchValue=""
          loading={false}
          onOwnedPageChange={noop}
          onSharedPageChange={noop}
        />
      </TestWrapper>,
    );

    // Check personal projects section
    const personalSection = screen.getByText('dashboard.main.personalProjects.title').closest('div');
    expect(personalSection?.parentElement).toHaveClass('my-12');

    // Check shared projects section
    const sharedSection = screen.getByText('dashboard.main.sharedProjects.title').closest('div');
    expect(sharedSection?.parentElement).toHaveClass('my-20');

    // Check title styling
    expect(screen.getByText('dashboard.main.personalProjects.title')).toHaveClass(
      'text-md',
      'font-medium',
      'font-inter',
      'text-black',
    );

    expect(screen.getByText('dashboard.main.personalProjects.description')).toHaveClass(
      'text-xs',
      'font-regular',
      'font-inter',
      'text-grey-1',
    );
  });

  it('shows search results section when searching', () => {
    const owned = [
      {
        projectId: '1',
        name: 'Project A',
        lastModified: new Date('2024-01-01'),
        createdDate: new Date('2024-01-01'),
        university: 'Monash',
        faculty: 'IT',
        lead: 'A',
        status: 'Active',
      },
    ] as ProjectSummaryInfo[];

    const shared = [
      {
        projectId: '2',
        name: 'Project B',
        lastModified: new Date('2024-02-01'),
        createdDate: new Date('2024-02-01'),
        university: 'Monash',
        faculty: 'IT',
        lead: 'B',
        status: 'Active',
      },
    ] as ProjectSummaryInfo[];

    render(
      <TestWrapper>
        <Projects
          ownedProjects={owned}
          sharedProjects={shared}
          ownedPagination={{ page: 1, limit: 12, total: 1, totalPages: 1 }}
          sharedPagination={{ page: 1, limit: 12, total: 1, totalPages: 1 }}
          layout="grid"
          searchValue="project"
          loading={false}
          onOwnedPageChange={noop}
          onSharedPageChange={noop}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('dashboard.main.searchResults.title')).toBeInTheDocument();
    expect(screen.getByText('dashboard.main.searchResults.count')).toBeInTheDocument();

    // Should not show default headers
    expect(screen.queryByText('dashboard.main.personalProjects.title')).not.toBeInTheDocument();
    expect(screen.queryByText('dashboard.main.sharedProjects.title')).not.toBeInTheDocument();

    // ProjectList should receive both items
    expect(screen.getByTestId('project-count')).toHaveTextContent('2');
  });

  it('when search has no results, shows empty state', () => {
    render(
      <TestWrapper>
        <Projects
          ownedProjects={[]}
          sharedProjects={[]}
          ownedPagination={{ page: 1, limit: 12, total: 0, totalPages: 0 }}
          sharedPagination={{ page: 1, limit: 12, total: 0, totalPages: 0 }}
          layout="grid"
          searchValue="definitely-no-match"
          loading={false}
          onOwnedPageChange={noop}
          onSharedPageChange={noop}
        />
      </TestWrapper>,
    );

    expect(screen.getByText('dashboard.main.searchResults.title')).toBeInTheDocument();
  });

  it('renders projects in order provided by server', () => {
    const owned: ProjectSummaryInfo[] = [
      {
        projectId: 'o2',
        name: 'Owned New',
        createdDate: new Date('2024-03-01'),
        lastModified: new Date('2024-03-01'),
        university: 'U',
        faculty: 'F',
        lead: 'L',
        status: 'Active',
      },
      {
        projectId: 'o1',
        name: 'Owned Old',
        createdDate: new Date('2024-01-01'),
        lastModified: new Date('2024-01-01'),
        university: 'U',
        faculty: 'F',
        lead: 'L',
        status: 'Active',
      },
    ];

    const shared: ProjectSummaryInfo[] = [
      {
        projectId: 's2',
        name: 'Shared New',
        createdDate: new Date('2024-02-10'),
        lastModified: new Date('2024-02-10'),
        university: 'U',
        faculty: 'F',
        lead: 'L',
        status: 'Active',
      },
      {
        projectId: 's1',
        name: 'Shared Old',
        createdDate: new Date('2024-01-10'),
        lastModified: new Date('2024-01-10'),
        university: 'U',
        faculty: 'F',
        lead: 'L',
        status: 'Active',
      },
    ];

    render(
      <TestWrapper>
        <Projects
          ownedProjects={owned}
          sharedProjects={shared}
          ownedPagination={{ page: 1, limit: 12, total: 2, totalPages: 1 }}
          sharedPagination={{ page: 1, limit: 12, total: 2, totalPages: 1 }}
          layout="grid"
          searchValue=""
          loading={false}
          onOwnedPageChange={noop}
          onSharedPageChange={noop}
        />
      </TestWrapper>,
    );

    const lists = screen.getAllByTestId('project-names');
    const ownedNames = lists[0].textContent;
    const sharedNames = lists[1].textContent;

    expect(ownedNames).toBe('Owned New|Owned Old');
    expect(sharedNames).toBe('Shared New|Shared Old');
  });
});
