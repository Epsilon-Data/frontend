import { deleteProject } from '@app/api/projects.api';
import { useAppSelector } from '@app/hooks/reduxHooks';
import { Button, message, Popconfirm } from 'antd';
import { Trans, useTranslation } from 'react-i18next';
import { AiFillDelete } from 'react-icons/ai';
import { BsFillQuestionCircleFill } from 'react-icons/bs';
import { FaCheck } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { MultiStepDatabaseModal } from '../access-requests/modal/MultiStepDatabaseModal';
import { useDatabaseModalContext } from '@app/hooks/useDatabaseModalContext';

type FallbackStateProps = {
  projectStatus: string;
  projectId: string;
  projectOwner: string;
};

export const FallbackState = ({ projectStatus, projectId, projectOwner }: FallbackStateProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user.user);
  const isOwner = user?.sub === projectOwner;
  const { showModal } = useDatabaseModalContext();

  const confirmDeletion = async () => {
    try {
      await deleteProject(projectId);
      message.success(t('project.main.dbMapping.fallback.actions.delete.success'));
    } catch {
      message.error(t('project.main.dbMapping.fallback.actions.delete.failed'));
    }
    navigate('/');
  };

  return (
    <div className="relative mt-6 overflow-hidden bg-grey-4 min-h-[500px]">
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        {projectStatus === 'READY' && <FaCheck className="text-blueDark/60 mb-5" size={90} />}
        <div className="text-2xl md:text-3xl font-semibold text-grey-9">
          {t(`project.main.dbMapping.fallback.${projectStatus.toLowerCase()}.title`)}
        </div>
        <div className="mt-2 text-sm md:text-base text-grey-7 font-light">
          <Trans
            i18nKey={`project.main.dbMapping.fallback.${projectStatus.toLowerCase()}.description`}
            components={{ bold: <strong className="font-semibold" /> }}
          />
        </div>
        {projectStatus != 'READY' && isOwner && (
          <div className="flex gap-5 mt-8">
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
            <Button
              className="flex items-center px-8 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
              type="primary"
              onClick={showModal}
            >
              {t('project.main.dbMapping.fallback.actions.edit')}
            </Button>
            <MultiStepDatabaseModal projectId={projectId} mask closable={false} width={'60%'} />
          </div>
        )}
      </div>
    </div>
  );
};
