import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MultiStepProjectModal } from './MultiStepProjectModal';

import { DatabaseConnectionStepProps } from './steps/DatabaseConnectionStep';
import { ModalStepHeaderProps } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { ButtonProps } from 'antd';
import { AboutProjectStepProps } from './steps/AboutProjectStep';

// Mock dependencies
const mockSetModalStep = vi.fn();
const mockSetIsModalOpen = vi.fn();
const mockHandleDraft = vi.fn();
const mockFetchProjects = vi.fn();

const mockForms = [
  {
    getFieldValue: vi.fn(),
    validateFields: vi.fn(),
    resetFields: vi.fn(),
    setFieldsValue: vi.fn(),
  },
  {
    getFieldValue: vi.fn(),
    validateFields: vi.fn(),
    resetFields: vi.fn(),
    setFieldsValue: vi.fn(),
  },
  {
    getFieldValue: vi.fn(),
    validateFields: vi.fn(),
    resetFields: vi.fn(),
    setFieldsValue: vi.fn(),
  },
  {
    getFieldValue: vi.fn(),
    validateFields: vi.fn(),
    resetFields: vi.fn(),
    setFieldsValue: vi.fn(),
  },
];

// Mock the context hook
vi.mock('@app/hooks/useProjectModalContext', () => ({
  useProjectModalContext: () => ({
    modalStep: 0,
    setModalStep: mockSetModalStep,
    setIsModalOpen: mockSetIsModalOpen,
    isModalOpen: true,
    handleDraft: mockHandleDraft,
    forms: mockForms,
  }),
}));

// Mock Redux hook
vi.mock('@app/hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    id: 'user-123',
    firstName: 'John',
    lastName: 'Doe',
  }),
}));

// Mock translation hook
const mockT = vi.fn((key: string) => key);
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: mockT,
  }),
}));

// Mock API
vi.mock('@app/api/projects.api', () => ({
  createProject: vi.fn(),
}));

// Mock step components
vi.mock('./steps/AboutProjectStep', () => ({
  AboutProjectStep: ({ members, setMembers, dbKeywords, setDbKeywords }: AboutProjectStepProps) => (
    <div data-testid="about-project-step">
      About Project Step
      <button
        data-testid="add-member"
        onClick={() => setMembers([...members, { email: 'test@example.com', role: 'researcher' }])}
      >
        Add Member
      </button>
      <button data-testid="add-keyword" onClick={() => setDbKeywords([...dbKeywords, 'test-keyword'])}>
        Add Keyword
      </button>
    </div>
  ),
}));

vi.mock('./steps/UniversityDetailsStep', () => ({
  UniversityDetailsStep: () => <div data-testid="university-details-step">University Details Step</div>,
}));

vi.mock('./steps/DatabaseConnectionStep', () => ({
  DatabaseConnectionStep: ({ showMessage, setShowMessage }: DatabaseConnectionStepProps) => (
    <div data-testid="database-connection-step">
      Database Connection Step
      <button data-testid="toggle-message" onClick={() => setShowMessage(!showMessage)}>
        Toggle Message
      </button>
    </div>
  ),
}));

vi.mock('./steps/ConfirmStep', () => ({
  ConfirmStep: () => <div data-testid="confirm-step">Confirm Step</div>,
}));

vi.mock('@app/components/common/Modal/ModalHeaders/ModalHeaders', () => ({
  ModalStepHeader: ({ modalStep, handleDraft, stepTitles }: ModalStepHeaderProps) => (
    <div data-testid="modal-step-header">
      <span data-testid="current-step">{modalStep}</span>
      <span data-testid="step-title">{stepTitles[modalStep]}</span>
      <button data-testid="draft-button" onClick={handleDraft}>
        Save Draft
      </button>
    </div>
  ),
}));

// Mock Ant Design Modal
vi.mock('antd', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Modal: ({ children, open, onCancel, footer }: any) =>
    open ? (
      <div data-testid="modal">
        <div data-testid="modal-content">{children}</div>
        <div data-testid="modal-footer">{footer}</div>
        <button data-testid="modal-close" onClick={onCancel}>
          Close
        </button>
      </div>
    ) : null,
  Button: ({ children, onClick, loading, icon, className, ...props }: ButtonProps) => (
    <button
      data-testid={props['data-testid'] || 'button'}
      onClick={onClick}
      disabled={Boolean(loading)}
      className={className}
    >
      {loading ? 'Loading...' : children}
      {icon}
    </button>
  ),
}));

// Mock react-icons
vi.mock('react-icons/io5', () => ({
  IoChevronForwardOutline: () => <span data-testid="chevron-icon">→</span>,
}));

describe('MultiStepProjectModal', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    mockT.mockImplementation((key: string) => key);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  const defaultProps = {
    fetchProjects: mockFetchProjects,
  };

  it('renders modal when open', () => {
    render(<MultiStepProjectModal {...defaultProps} />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-step-header')).toBeInTheDocument();
  });

  it('renders AboutProjectStep on step 0', () => {
    render(<MultiStepProjectModal {...defaultProps} />);

    expect(screen.getByTestId('about-project-step')).toBeInTheDocument();
    expect(screen.queryByTestId('university-details-step')).not.toBeInTheDocument();
  });

  it('displays correct step title in header', () => {
    render(<MultiStepProjectModal {...defaultProps} />);

    expect(screen.getByTestId('step-title')).toHaveTextContent('dashboard.createProject.form.step1.title');
  });

  it('shows Next button on non-final steps', () => {
    render(<MultiStepProjectModal {...defaultProps} />);

    const nextButton = screen.getByText('common.next');
    expect(nextButton).toBeInTheDocument();
    expect(screen.queryByText('dashboard.createProject.form.submit')).not.toBeInTheDocument();
  });

  it('calls setModalStep when Next button is clicked', async () => {
    render(<MultiStepProjectModal {...defaultProps} />);

    const nextButton = screen.getByText('common.next');
    await user.click(nextButton);

    expect(mockSetModalStep).toHaveBeenCalledWith(expect.any(Function));
  });

  // it('calls handleDraft when draft button is clicked', async () => {
  //   render(<MultiStepProjectModal {...defaultProps} />);

  //   const draftButton = screen.getByTestId('draft-button');
  //   await user.click(draftButton);

  //   expect(mockHandleDraft).toHaveBeenCalled();
  // });
});
