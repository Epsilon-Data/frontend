import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { MultiStepBrowseModal } from './MultiStepBrowseModal';
import { RequestAccessPageProps } from './pages/RequestAccessPage';
import { ModalAccessHeaderProps } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { Member } from '@app/api/analysisRequests.api';

const mockSetModalStep = vi.fn();
const mockSetIsModalOpen = vi.fn();

const mockValidateMembers = vi.fn((): { normalized: string[]; invalid: string[]; duplicates: string[] } => ({
  normalized: [],
  invalid: [],
  duplicates: [],
}));

const mockForm = {
  getFieldValue: vi.fn(),
  validateFields: vi.fn(),
  resetFields: vi.fn(),
  setFieldsValue: vi.fn(),
  setFields: vi.fn(),
  scrollToField: vi.fn(),
};

let modalStepValue = 0;

// Mock context hook
vi.mock('@app/hooks/useBrowseModalContext', () => ({
  useBrowseModalContext: () => ({
    modalStep: modalStepValue,
    setModalStep: mockSetModalStep,
    setIsModalOpen: mockSetIsModalOpen,
    isModalOpen: true,
    form: mockForm,
    project: { projectId: 'proj-1', projectName: 'Test Project' },
    validateMembers: mockValidateMembers,
  }),
}));

// Mock Redux hook
vi.mock('@app/hooks/reduxHooks', () => ({
  useAppSelector: () => ({
    id: 'user-123',
    firstName: 'John',
    lastName: 'Doe',
    email: { name: 'john.doe@example.com' },
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
vi.mock('@app/api/analysisRequests.api', () => ({
  createRequest: vi.fn(),
}));

// React Flow hooks used by the component
vi.mock('reactflow', () => ({
  useNodesState: (initial: unknown[]) => [initial, vi.fn(), vi.fn()],
  useEdgesState: (initial: unknown[]) => [initial, vi.fn(), vi.fn()],
}));

// Mock page components
vi.mock('./pages/AboutDatasetPage/AboutDatasetPage', () => ({
  AboutDatasetPage: () => <div data-testid="about-dataset-page">About Dataset Page</div>,
}));

vi.mock('./pages/RequestAccessPage', () => ({
  RequestAccessPage: ({ members, setMembers }: RequestAccessPageProps) => (
    <div data-testid="request-access-page">
      Request Access Page
      <button
        data-testid="add-member"
        onClick={() =>
          setMembers([...(members || ([] as Member[])), { email: 'test@example.com', role: 'researcher' } as Member])
        }
      >
        Add Member
      </button>
    </div>
  ),
}));

vi.mock('./pages/SubmissionResultPage', () => ({
  SubmissionResultPage: () => <div data-testid="submission-result-page">Submission Result Page</div>,
}));

// Modal header
vi.mock('@app/components/common/Modal/ModalHeaders/ModalHeaders', () => ({
  ModalAccessHeader: ({ modalStep, setModalStep, setIsModalOpen }: ModalAccessHeaderProps) => (
    <div data-testid="modal-access-header">
      <span data-testid="current-step">{modalStep}</span>
      <button data-testid="go-to-previous-step" onClick={() => setModalStep((prev) => prev - 1)}>
        Go to Previous Step
      </button>
      <button data-testid="Close" onClick={() => setIsModalOpen(false)}>
        Close
      </button>
    </div>
  ),
}));

// Ant Design Modal/Button
vi.mock('antd', () => ({
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Modal: ({ children, open, onCancel, footer, ...props }: any) =>
    open ? (
      <div data-testid="modal" {...props}>
        <div data-testid="modal-content">{children}</div>
        <div data-testid="modal-footer">{footer}</div>
        <button data-testid="modal-close" onClick={onCancel}>
          Close
        </button>
      </div>
    ) : null,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  Button: ({ children, onClick, loading, icon, className, ...props }: any) => (
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

// Icons
vi.mock('react-icons/io5', () => ({
  IoChevronForwardOutline: () => <span data-testid="chevron-forward">→</span>,
  IoChevronBackOutline: () => <span data-testid="chevron-back">←</span>,
}));

describe('MultiStepBrowseModal', () => {
  const user = userEvent.setup();

  beforeEach(() => {
    vi.clearAllMocks();
    modalStepValue = 0;
    mockT.mockImplementation((key: string) => key);
    mockForm.validateFields.mockResolvedValue(undefined);
    mockValidateMembers.mockReturnValue({ normalized: [], invalid: [], duplicates: [] });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('renders modal when open and shows header', () => {
    render(<MultiStepBrowseModal />);

    expect(screen.getByTestId('modal')).toBeInTheDocument();
    expect(screen.getByTestId('modal-access-header')).toBeInTheDocument();
    expect(screen.getByTestId('current-step')).toHaveTextContent('0');
  });

  it('renders AboutDatasetPage at step 0 and has no footer', () => {
    modalStepValue = 0;
    render(<MultiStepBrowseModal />);

    expect(screen.getByTestId('about-dataset-page')).toBeInTheDocument();
    // footer is rendered as a div; for step 0, renderFooter() returns null
    expect(screen.getByTestId('modal-footer')).toBeEmptyDOMElement();
  });

  it('renders RequestAccessPage and shows Submit button at step 1', () => {
    modalStepValue = 1;
    render(<MultiStepBrowseModal />);

    expect(screen.getByTestId('request-access-page')).toBeInTheDocument();
    expect(screen.getByText('common.submit')).toBeInTheDocument();
  });

  it('successful submit at step 1 calls createRequest and advances step', async () => {
    modalStepValue = 1;
    render(<MultiStepBrowseModal />);

    const submit = screen.getByText('common.submit');
    await user.click(submit);

    expect(mockForm.validateFields).toHaveBeenCalled();
    expect(mockSetModalStep).toHaveBeenCalledWith(expect.any(Function));
  });

  it('validation errors (invalid/duplicate emails) prevent submission and show errors on form', async () => {
    modalStepValue = 1;
    mockValidateMembers.mockReturnValue({
      normalized: [],
      invalid: ['bad@'],
      duplicates: ['dup@example.com'],
    });

    render(<MultiStepBrowseModal />);

    await user.click(screen.getByText('common.submit'));

    expect(mockForm.setFields).toHaveBeenCalledWith(
      expect.arrayContaining([
        expect.objectContaining({
          name: 'projectMembers',
          errors: expect.arrayContaining([
            expect.stringContaining('Invalid email(s): bad@'),
            expect.stringContaining('Duplicate email(s): dup@example.com'),
          ]),
        }),
      ]),
    );
    expect(mockForm.scrollToField).toHaveBeenCalledWith('projectMembers', expect.any(Object));
    expect(mockSetModalStep).not.toHaveBeenCalled();
  });

  it('renders SubmissionResultPage and footer actions at step 2; Return closes modal', async () => {
    modalStepValue = 2;
    render(<MultiStepBrowseModal />);

    expect(screen.getByTestId('submission-result-page')).toBeInTheDocument();

    // Both footer buttons should exist
    expect(screen.getByText('browse.createRequest.nextSteps.viewRequests')).toBeInTheDocument();
    const returnBtn = screen.getByText('browse.createRequest.nextSteps.return');
    expect(returnBtn).toBeInTheDocument();

    await user.click(returnBtn);
    expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
  });

  it('onCancel closes the modal', async () => {
    modalStepValue = 1;
    render(<MultiStepBrowseModal />);

    await user.click(screen.getByTestId('modal-close'));
    expect(mockSetIsModalOpen).toHaveBeenCalledWith(false);
  });
});
