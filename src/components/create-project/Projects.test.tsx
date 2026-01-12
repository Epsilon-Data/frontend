import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { Projects } from './Projects';
import { faker } from '@faker-js/faker';
import { ProjectSummaryInfo } from '@app/api/projects.api';

// Mock the dependencies
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
vi.mock('./ProjectList', () => ({
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

describe('Projects Component', () => {
  const mockOwnedProjects = generateMockProjects(2);
  const mockSharedProjects = generateMockProjects(2);

  beforeEach(() => {
    vi.clearAllMocks();
    mockT.mockImplementation((key: string) => key);
  });

  it('renders succesfully when provided mock projects', () => {
    render(
      <TestWrapper>
        <Projects ownedProjects={mockOwnedProjects} sharedProjects={mockSharedProjects} layout="grid" />
      </TestWrapper>,
    );

    expect(screen.getByText('dashboard.main.personalProjects.title')).toBeInTheDocument();
    expect(screen.getByText('dashboard.main.sharedProjects.title')).toBeInTheDocument();
  });

  it('displays personal projects section with correct title and description', () => {
    render(
      <TestWrapper>
        <Projects ownedProjects={mockOwnedProjects} sharedProjects={mockSharedProjects} layout="grid" />
      </TestWrapper>,
    );

    expect(screen.getByText('dashboard.main.personalProjects.title')).toBeInTheDocument();
    expect(screen.getByText('dashboard.main.personalProjects.description')).toBeInTheDocument();
  });

  it('displays shared projects section with correct title and description', () => {
    render(
      <TestWrapper>
        <Projects ownedProjects={mockOwnedProjects} sharedProjects={mockSharedProjects} layout="grid" />
      </TestWrapper>,
    );

    expect(screen.getByText('dashboard.main.sharedProjects.title')).toBeInTheDocument();
    expect(screen.getByText('dashboard.main.sharedProjects.description')).toBeInTheDocument();
  });

  it('applies correct CSS classes', () => {
    render(
      <TestWrapper>
        <Projects ownedProjects={mockOwnedProjects} sharedProjects={mockSharedProjects} layout="grid" />
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

    // Check description styling
    expect(screen.getByText('dashboard.main.personalProjects.description')).toHaveClass(
      'text-xs',
      'font-regular',
      'font-inter',
      'text-grey-1',
    );
  });
});
