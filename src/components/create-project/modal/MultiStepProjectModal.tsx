import { UniversityDetailsStep } from './steps/UniversityDetailsStep';
import { DatabaseConnectionStep } from './steps/DatabaseConnectionStep';
import { ConfirmStep } from './steps/ConfirmStep';
import { Button, Modal, message } from 'antd';
import { IoChevronBackOutline, IoChevronForwardOutline } from 'react-icons/io5';

import { useState, useEffect } from 'react';
import { createProject, updateProject, ProjectInfo } from '@app/api/projects.api';
import { useTranslation } from 'react-i18next';
import { ModalStepHeader } from '@app/components/common/Modal/ModalHeaders/ModalHeaders';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { useProjectModalContext } from '@app/hooks/useProjectModalContext';
import { useProjectOptional } from '@app/hooks/useProjectContext';
import { ValidateErrorEntity } from 'rc-field-form/lib/interface';
import { AboutProjectStep } from './steps/AboutProjectStep';
import { buildDatabaseUrl } from '@app/utils/databaseUrl';
import dayjs from 'dayjs';

type MultiStepProjectModalProps = {
  fetchProjects?: () => Promise<void>;
  editingProject?: ProjectInfo;
} & React.ComponentProps<typeof Modal>;

export const MultiStepProjectModal = ({ fetchProjects, editingProject, ...modalProps }: MultiStepProjectModalProps) => {
  const [isFormLoading, setFormLoading] = useState(false);
  const { modalStep, setModalStep, setIsModalOpen, isModalOpen, forms } = useProjectModalContext();
  const projectContext = useProjectOptional();
  const user = useAppSelector((state) => state.user?.user);

  const [step1, step2, step3, step4] = forms;
  const [dbKeywords, setDbKeywords] = useState<string[]>([]);
  const { t } = useTranslation();
  const [showMessage, setShowMessage] = useState(false);
  const [isConnected, setConnected] = useState(false);
  const [dbUrl, setDbUrl] = useState('');

  // Pre-fill form if editing
  useEffect(() => {
    if (editingProject && isModalOpen) {
      const { startDate, endDate, members, connection } = editingProject;

      step1.setFieldsValue({
        name: editingProject.name,
        description: editingProject.description,
        participantsNum: editingProject.participantsNum,
        members: members || [],
        duration: startDate && endDate ? [dayjs(startDate), dayjs(endDate)] : undefined,
      });

      step2.setFieldsValue({
        university: editingProject.university,
        faculty: editingProject.faculty,
        ethicsId: editingProject.ethicsId,
      });

      // Pre-fill DB keywords
      if (editingProject.dbKeywords) {
        setDbKeywords(editingProject.dbKeywords);
      }

      // Pre-fill connection details
      if (connection?.dbDetails) {
        const { dbDetails } = connection;
        step3.setFieldsValue({
          dbType: dbDetails.type,
          hostname: dbDetails.host,
          port: dbDetails.port,
          username: dbDetails.username,
          password: dbDetails.password,
          name: dbDetails.name,
          ssl: dbDetails.ssl,
          isDbUrl: !!dbDetails.url,
          dbUrl: dbDetails.url,
        });
        setDbUrl(dbDetails.url || '');
        setConnected(true);
      }

      if (connection?.orgAdminEmail) {
        step3.setFieldsValue({
          orgAdminEmail: connection.orgAdminEmail,
        });
      }
    }
  }, [editingProject, isModalOpen, step1, step2, step3]);

  const lastStep = editingProject ? 2 : 3;

  const nextStep = async () => {
    try {
      await forms[modalStep].validateFields();

      if (modalStep === 2) {
        const shouldUpdateDb = editingProject ? step3.getFieldValue('updateDatabase') : true;
        const hasCredsValue = !editingProject ? step3.getFieldValue('hasCreds') : true;

        if (shouldUpdateDb && !isConnected && hasCredsValue) {
          message.error(t('dashboard.createProject.form.error.invalidDbUrl'));
          return;
        }
      }

      setModalStep((prev) => Math.min(prev + 1, lastStep));
    } catch (err) {
      const error = err as ValidateErrorEntity;
      if (error.errorFields) {
        forms[modalStep].scrollToField(error.errorFields[0].name, {
          behavior: 'smooth',
          block: 'center',
        });
      }
    }
  };

  const prevStep = () => setModalStep((prev) => Math.max(prev - 1, 0));

  const stepTitles = [
    t('dashboard.createProject.form.step1.title'),
    t('dashboard.createProject.form.step2.title'),
    t('dashboard.createProject.form.step3.title'),
    ...(editingProject ? [] : [t('dashboard.createProject.form.step4.title')]),
  ];

  const submitButtonText = editingProject?.projectId ? t('common.save') : t('common.submit');

  const handleCreate = async () => {
    setFormLoading(true);

    const [startDate, endDate] = step1.getFieldValue('duration') || [];

    const rawDbUrl = dbUrl?.trim() ?? '';

    const type = step3.getFieldValue('dbType') || '';
    const host = step3.getFieldValue('hostname') || '';
    const port = step3.getFieldValue('port') || '';
    const username = step3.getFieldValue('username') || '';
    const password = step3.getFieldValue('password') || '';
    const name = step3.getFieldValue('name') || '';
    const ssl = step3.getFieldValue('ssl') || false;

    let finalUrl = rawDbUrl;
    if (!finalUrl) {
      const built = buildDatabaseUrl({ type, host, port, username, password, name, ssl });
      if (built) finalUrl = built;
    }

    let parsedUrl: URL | null = null;
    if (finalUrl) {
      try {
        parsedUrl = new URL(finalUrl);
      } catch {
        console.warn('Invalid DB URL generated/provided, skipping parsing.');
      }
    }

    try {
      if (!editingProject) {
        const formData = {
          ownerId: user?.sub ?? '',
          name: step1.getFieldValue('name'),
          lead: (user?.given_name ?? '') + ' ' + (user?.family_name ?? ''),
          university: step2.getFieldValue('university'),
          faculty: step2.getFieldValue('faculty'),
          ethicsId: step2.getFieldValue('ethicsId'),
          description: step1.getFieldValue('description'),
          startDate: startDate?.toDate() || null,
          endDate: endDate?.toDate() || null,
          members: (step1.getFieldValue('members') || []).filter((m: { email: string }) => m?.email),
          participantsNum: step1.getFieldValue('participantsNum'),
          dbKeywords: dbKeywords,
          connection: {
            orgAdminEmail: step3.getFieldValue('orgAdminEmail'),
            dbDetails: {
              name: name || parsedUrl?.pathname.replace(/^\//, '') || '',
              type: type || (parsedUrl?.protocol.replace(':', '') ?? ''),
              host: host || parsedUrl?.hostname || '',
              port: port || parsedUrl?.port || '',
              url: finalUrl || undefined,
              username: username || parsedUrl?.username || '',
              password: password || parsedUrl?.password || '',
              ssl: ssl || parsedUrl?.searchParams.get('sslmode')?.toLowerCase() !== 'disable' || false,
            },
          },
        };

        await step4.validateFields();
        console.log('Creating project with data:', formData);
        await createProject(formData);
        message.success(t('dashboard.createProject.success'));
      } else {
        // Build minimal update payload with only changed fields
        const payload: Partial<ProjectInfo> = {};
        payload.projectId = editingProject.projectId;

        const nameVal = step1.getFieldValue('name');
        if (nameVal && nameVal !== editingProject.name) payload.name = nameVal;

        const descVal = step1.getFieldValue('description');
        if (descVal !== editingProject.description) payload.description = descVal;

        if (startDate || endDate) {
          const startIso = startDate?.toDate ? startDate.toDate().toISOString() : null;
          const endIso = endDate?.toDate ? endDate.toDate().toISOString() : null;
          const startSame = editingProject.startDate ? dayjs(editingProject.startDate).isSame(startIso) : false;
          const endSame = editingProject.endDate ? dayjs(editingProject.endDate).isSame(endIso) : false;
          if (!startSame || !endSame) {
            payload.startDate = startIso;
            payload.endDate = endIso;
          }
        }

        const membersVal = (step1.getFieldValue('members') || []).filter((m: { email: string }) => m?.email);
        if (JSON.stringify(membersVal) !== JSON.stringify(editingProject.members || [])) payload.members = membersVal;

        const participantsVal = step1.getFieldValue('participantsNum');
        if (participantsVal !== editingProject.participantsNum) payload.participantsNum = participantsVal;

        if (dbKeywords && JSON.stringify(dbKeywords) !== JSON.stringify(editingProject.dbKeywords || []))
          payload.dbKeywords = dbKeywords;

        const uniVal = step2.getFieldValue('university');
        if (uniVal !== editingProject.university) payload.university = uniVal;
        const facultyVal = step2.getFieldValue('faculty');
        if (facultyVal !== editingProject.faculty) payload.faculty = facultyVal;
        const ethicsVal = step2.getFieldValue('ethicsId');
        if (ethicsVal !== editingProject.ethicsId) payload.ethicsId = ethicsVal;

        // Only include database details if user chose to update database
        const shouldUpdateDatabase = step3.getFieldValue('updateDatabase');
        if (shouldUpdateDatabase && isConnected) {
          payload.connection = {
            orgAdminEmail: step3.getFieldValue('orgAdminEmail'),
            dbDetails: {
              name: name || parsedUrl?.pathname.replace(/^\//, '') || '',
              type: type || (parsedUrl?.protocol.replace(':', '') ?? ''),
              host: host || parsedUrl?.hostname || '',
              port: port || parsedUrl?.port || '',
              url: finalUrl || undefined,
              username: username || parsedUrl?.username || '',
              password: password || parsedUrl?.password || '',
              ssl: ssl || parsedUrl?.searchParams.get('sslmode')?.toLowerCase() !== 'disable' || false,
            },
          };
        }

        console.log('Updating project with payload:', payload);
        await updateProject(payload, editingProject.projectId);
        message.success(t('project.main.settings.update.success'));

        // Optimistically update the project context immediately
        if (projectContext?.updateProjectLocally) {
          projectContext.updateProjectLocally((prev) => {
            if (!prev) return prev;
            return {
              ...prev,
              ...payload,
              // Merge connection object if it exists
              connection: payload.connection
                ? {
                    ...prev.connection,
                    ...payload.connection,
                  }
                : prev.connection,
            };
          });

          // Then refresh in the background to ensure we have the latest data
          projectContext.refresh().catch(() => {
            console.warn('Failed to refresh project context');
          });
        }
      }

      setIsModalOpen(false);
      if (fetchProjects) {
        await fetchProjects();
      }
    } catch (error) {
      console.error('Project operation failed:', error);
      message.error(
        editingProject?.projectId ? t('project.main.settings.update.failed') : t('dashboard.createProject.failed'),
      );
    } finally {
      setFormLoading(false);
    }
  };

  const renderStep = () => {
    switch (modalStep) {
      case 0:
        return (
          <AboutProjectStep
            form={step1}
            dbKeywords={dbKeywords}
            setDbKeywords={setDbKeywords}
            hideMembers={!!editingProject}
          />
        );
      case 1:
        return <UniversityDetailsStep form={step2} />;
      case 2:
        return (
          <DatabaseConnectionStep
            form={step3}
            showMessage={showMessage}
            setShowMessage={setShowMessage}
            isConnected={isConnected}
            setConnected={setConnected}
            setDbUrl={setDbUrl}
            isEditing={!!editingProject}
          />
        );
      case 3:
        return <ConfirmStep form={step4} />;
      default:
        return null;
    }
  };

  return (
    <Modal
      maskClosable={true}
      open={isModalOpen}
      onCancel={() => setIsModalOpen(false)}
      {...modalProps}
      footer={
        <div className="flex items-center justify-between w-full">
          <div>
            {modalStep > 0 && (
              <Button
                key="back"
                onClick={prevStep}
                disabled={isFormLoading}
                icon={<IoChevronBackOutline />}
                className="flex items-center h-9 text-blueDark text-xs font-medium font-inter"
              >
                {t('common.back')}
              </Button>
            )}
          </div>
          <div>
            {modalStep < lastStep ? (
              <Button
                key="next"
                type="primary"
                onClick={nextStep}
                icon={<IoChevronForwardOutline />}
                iconPlacement="end"
                className="flex items-center w-60 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
              >
                {t('common.next')}
              </Button>
            ) : (
              <Button
                key="submit"
                type="primary"
                onClick={handleCreate}
                icon={<IoChevronForwardOutline />}
                iconPlacement="end"
                loading={isFormLoading}
                className="flex items-center w-60 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
              >
                {submitButtonText}
              </Button>
            )}
          </div>
        </div>
      }
    >
      <div className="flex flex-col">
        <ModalStepHeader modalStep={modalStep} stepTitles={stepTitles} />
        {renderStep()}
      </div>
    </Modal>
  );
};
