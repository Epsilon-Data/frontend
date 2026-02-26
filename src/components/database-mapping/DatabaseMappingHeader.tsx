import { ArchetypeInfo, ArchetypeStatus, deleteArchetype, updateArchetypeDetails } from '@app/api/archetypes.api';
import { STATUS_COLORS, toTitleCase } from '@app/constants/archetype';
import { ModalMode } from '@app/context/ArchetypeModal';
import { Button, Tag, Popconfirm, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { AiFillDelete } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { BsFillQuestionCircleFill } from 'react-icons/bs';

type DatabaseMappingHeaderProps = {
  archetype?: ArchetypeInfo | undefined;
  projectId: string;
  projectStatus?: string;
  mode: ModalMode;
};

export const DatabaseMappingHeader = ({ archetype, projectId, projectStatus, mode }: DatabaseMappingHeaderProps) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const disableCreate = !['READY', 'MAPPED'].includes(projectStatus ?? '');

  const status = (archetype?.status as ArchetypeStatus | undefined) ?? 'DRAFT';

  const confirmDeletion = async () => {
    try {
      const { jobId } = await deleteArchetype(projectId, archetype?.archetypeId ?? '');
      message.success(t('project.main.dbMapping.table.manage.delete.success'));
      navigate(`/project/db-mapping?id=${projectId}`, {
        state: { jobId, archetypeName: archetype?.name },
      });
    } catch {
      message.error(t('project.main.dbMapping.table.manage.delete.failed'));
      navigate(`/project/db-mapping?id=${projectId}`);
    }
  };

  const handlePublish = async () => {
    if (!archetype) return;
    const isPublished = archetype.status === 'PUBLISHED';

    try {
      await updateArchetypeDetails(projectId, archetype?.archetypeId ?? '', {
        status: isPublished ? 'ACTIVE' : 'PUBLISHED',
      });
      message.success(t(`project.main.dbMapping.table.manage.${isPublished ? 'withdraw' : 'publish'}.success`));
    } catch {
      message.error(t(`project.main.dbMapping.table.manage.${isPublished ? 'withdraw' : 'publish'}.failed`));
    }
    navigate(`/project/db-mapping?id=${projectId}`);
  };

  const openWizard = () => {
    if (mode === 'create') {
      navigate(`/project/archetype/wizard?id=${projectId}`);
    } else {
      navigate(`/project/archetype/wizard?id=${projectId}&archetypeId=${archetype?.archetypeId}`);
    }
  };

  const DeleteButton = (
    <Popconfirm
      placement="bottom"
      title={t('project.main.dbMapping.table.manage.delete.title')}
      description={t('project.main.dbMapping.table.manage.delete.description')}
      okText="Yes"
      cancelText="No"
      onConfirm={confirmDeletion}
      icon={<BsFillQuestionCircleFill color="#ff4d4f" size={16} className="mr-2 mt-0.5" />}
    >
      <Button type="primary" danger icon={<AiFillDelete />} className="font-medium font-inter h-9 text-xs">
        {t('common.delete')}
      </Button>
    </Popconfirm>
  );

  const EditTemplateButton = (status: ArchetypeStatus) => (
    <Button
      className="flex items-center px-8 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
      type="primary"
      onClick={openWizard}
    >
      {status === 'DRAFT'
        ? t('project.main.dbMapping.table.manage.continueEdit')
        : t('project.main.dbMapping.table.manage.edit')}
    </Button>
  );

  const PublishButton = (status: ArchetypeStatus) => (
    <Popconfirm
      placement="bottom"
      title={t(`project.main.dbMapping.table.manage.${status === 'PUBLISHED' ? 'withdraw' : 'publish'}.title`)}
      description={t(
        `project.main.dbMapping.table.manage.${status === 'PUBLISHED' ? 'withdraw' : 'publish'}.description`,
      )}
      okText="Yes"
      cancelText="No"
      onConfirm={handlePublish}
      icon={<BsFillQuestionCircleFill color="#1677ff" size={16} className="mr-2 mt-0.5" />}
    >
      <Button
        variant="outlined"
        className="flex items-center px-8 h-9 text-xs font-medium font-inter text-blueDark border border-blueDark"
      >
        {status == 'PUBLISHED' ? t('common.withdraw') : t('common.publish')}
      </Button>
    </Popconfirm>
  );

  const renderActions = () => {
    if (mode == 'create') {
      return (
        <Button
          className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
          type="primary"
          icon={<FaPlus />}
          onClick={openWizard}
          disabled={disableCreate}
        >
          {t('project.main.dbMapping.newTemplate')}
        </Button>
      );
    }

    switch (status) {
      case 'DRAFT':
        return (
          <>
            {DeleteButton}
            {EditTemplateButton(status)}
          </>
        );
      default:
        return (
          <>
            {DeleteButton}
            {EditTemplateButton(status)}
            {PublishButton(status)}
          </>
        );
    }
  };

  return (
    <div className="flex items-center justify-between w-full mt-8 pb-4 border-b border-grey-3">
      <div className="flex gap-4 items-center">
        <div className="text-xl font-medium font-sans">
          {mode == 'create' ? t('project.main.dbMapping.title') : archetype?.name}
        </div>
        {mode == 'edit' && (
          <>
            <Tag color={STATUS_COLORS[status]} className="rounded-2xl py-0.5 px-3">
              {toTitleCase(status)}
            </Tag>
          </>
        )}
      </div>
      <div className="flex items-center gap-4 flex-wrap justify-end">{renderActions()}</div>
    </div>
  );
};
