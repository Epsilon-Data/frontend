import { deleteProject } from '@app/api/projects.api';
import { InputLabel } from '@app/components/common/Modal/InputLabel/InputLabel';
import { useProjectContext } from '@app/hooks/useProjectContext';
import { useProjectModalContext } from '@app/hooks/useProjectModalContext';
import { ProjectModalProvider } from '@app/providers/ProjectModalProvider';
import { Breadcrumb, Button, message, Popconfirm } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { AiFillDelete } from 'react-icons/ai';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { MultiStepProjectModal } from '@app/components/create-project/modal/MultiStepProjectModal';

const SettingsPageContent: React.FC = () => {
  const [searchParams] = useSearchParams();
  const projectId = searchParams.get('id') ?? '';
  const { t } = useTranslation();
  const { project } = useProjectContext();
  const navigate = useNavigate();
  const { setIsModalOpen, setModalStep } = useProjectModalContext();

  const confirmDeletion = async () => {
    try {
      await deleteProject(projectId);
      message.success(t('project.main.dbMapping.fallback.actions.delete.success'));
    } catch {
      message.error(t('project.main.dbMapping.fallback.actions.delete.failed'));
    }
    navigate('/');
  };

  const breadcrumbItems = [
    { title: <Link to="/">{t('project.breadcrumb.home')}</Link> },
    { title: project?.name || '' },
    { title: <Link to={`/project/settings?id=${projectId}`}>{t('project.breadcrumb.settings')}</Link> },
  ];

  const handleEditProject = () => {
    setModalStep(0);
    setIsModalOpen(true);
  };

  return (
    <div className="py-3 px-4 md:py-5 md:px-9">
      <Breadcrumb separator=">" className="my-4" items={breadcrumbItems} />
      <div className="flex items-start w-full mt-8 pb-4 mb-8 border-b border-grey-3">
        <div className="text-xl font-medium font-sans">{t('project.main.settings.title')}</div>
      </div>
      <div className="mb-10">
        <div className="text-2xl font-medium font-sans text-black">{project?.name}</div>
        <div className="text-base font-light font-inter text-black">
          <span className="font-normal">By: </span>
          {`${project?.university} - ${project?.faculty}`}
        </div>
      </div>

      <InputLabel
        inputTitle={t('project.main.settings.editProject.title')}
        inputDescription={t('project.main.settings.editProject.description')}
      />

      <Button
        className="flex items-center w-72 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white mb-8"
        type="primary"
        onClick={handleEditProject}
      >
        {t('project.main.settings.editProject.button')}
      </Button>

      <div className="border-2 border-red-300 border-solid rounded-xl mt-8 p-8">
        <InputLabel
          inputTitle={t('project.main.settings.delete.title')}
          inputDescription={t('project.main.settings.delete.description')}
        />
        <Popconfirm
          placement="bottom"
          title={t('project.main.dbMapping.fallback.actions.delete.confirm.title')}
          description={t('project.main.dbMapping.fallback.actions.delete.confirm.description')}
          okText="Yes"
          cancelText="No"
          onConfirm={confirmDeletion}
          icon={<BsFillQuestionCircleFill color="#ff4d4f" size={16} className="mr-2 mt-0.5" />}
        >
          <Button type="primary" danger icon={<AiFillDelete />} className="font-medium font-inter h-9 text-xs">
            {t('project.main.dbMapping.fallback.actions.delete.title')}
          </Button>
        </Popconfirm>
      </div>

      {project && <MultiStepProjectModal editingProject={project} fetchProjects={async () => {}} width={'60%'} />}
    </div>
  );
};

const SettingsPage: React.FC = () => {
  return <ProjectModalProvider>{[<SettingsPageContent key="content" />]}</ProjectModalProvider>;
};

export default SettingsPage;
