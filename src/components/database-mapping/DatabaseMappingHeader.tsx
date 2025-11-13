import { ArchetypeInfo, deleteArchetype, updateArchetypeDetails } from '@app/api/archetypes.api';
import { STATUS_COLORS, toTitleCase } from '@app/constants/archetype';
import { useArchetypeModalContext } from '@app/hooks/useArchetypeModalContext';
import { Button, Tag, Popconfirm, message } from 'antd';
import { useTranslation } from 'react-i18next';
import { AiFillDelete } from 'react-icons/ai';
import { FaPlus } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';
import { BsFillQuestionCircleFill } from 'react-icons/bs';

type DatabaseMappingHeaderProps = {
  archetype?: ArchetypeInfo | undefined;
  projectId: string;
};

export const DatabaseMappingHeader = ({ archetype, projectId }: DatabaseMappingHeaderProps) => {
  const { t } = useTranslation();
  const { mode, showModal } = useArchetypeModalContext();
  const navigate = useNavigate();

  const confirmDeletion = async () => {
    try {
      await deleteArchetype(projectId, archetype?.archetypeId ?? '');
      message.success(t('project.main.dbMapping.table.manage.delete.success'));
    } catch (error) {
      message.error(t('project.main.dbMapping.table.manage.delete.failed'));
    }
    navigate(`/project/db-mapping?id=${projectId}`, { state: { refetch: true } });
  };

  const handlePublish = async () => {
    if (!archetype) return;
    try {
      await updateArchetypeDetails(projectId, archetype?.archetypeId ?? '', { status: 'PUBLISHED' });
      message.success(t('project.main.dbMapping.table.manage.publish.success'));
    } catch (error) {
      message.error(t('project.main.dbMapping.table.manage.publish.failed'));
    }
    navigate(`/project/db-mapping?id=${projectId}`);
  };

  return (
    <div className="flex items-center justify-between w-full mt-8 pb-4 border-b border-grey-3">
      <div className="flex gap-4 items-center">
        <div className="text-xl font-medium font-sans">
          {mode == 'create' ? t('project.main.dbMapping.title') : archetype?.name}
        </div>
        {mode == 'edit' && (
          <>
            <Tag color={STATUS_COLORS[archetype?.status ?? '']} className="rounded-2xl py-0.5 px-3">
              {toTitleCase(archetype?.status ?? '')}
            </Tag>
          </>
        )}
      </div>
      <div className="flex items-center gap-4 flex-wrap justify-end">
        {mode == 'create' ? (
          <Button
            className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
            type="primary"
            icon={<FaPlus />}
            onClick={showModal}
          >
            {t('project.main.dbMapping.newTemplate')}
          </Button>
        ) : (
          <>
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
            <Button
              className="flex items-center px-8 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
              type="primary"
              onClick={showModal}
            >
              {t('project.main.dbMapping.table.manage.edit')}
            </Button>
            <Popconfirm
              placement="bottom"
              title={t('project.main.dbMapping.table.manage.publish.title')}
              description={t('project.main.dbMapping.table.manage.publish.description')}
              okText="Yes"
              cancelText="No"
              onConfirm={handlePublish}
              icon={<BsFillQuestionCircleFill color="#1677ff" size={16} className="mr-2 mt-0.5" />}
            >
              <Button
                variant="outlined"
                className="flex items-center px-8 h-9 text-xs font-medium font-inter text-blueDark border border-blueDark"
              >
                {t('common.publish')}
              </Button>
            </Popconfirm>
          </>
        )}
      </div>
    </div>
  );
};
