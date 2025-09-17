import { useArchetypeModalContext } from '@app/hooks/useArchetypeModalContext';
import { Button } from 'antd';
import { useTranslation } from 'react-i18next';
import { FaPlus } from 'react-icons/fa6';

export const DatabaseMappingHeader = () => {
  const { t } = useTranslation();
  const { showModal } = useArchetypeModalContext();

  return (
    <div className="flex items-center justify-between w-full mt-8 pb-4 border-b border-grey-3">
      <div className="text-xl font-medium font-sans">{t('project.main.dbMapping.title')}</div>
      <div className="flex items-center gap-4 flex-wrap justify-end">
        <Button
          className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
          type="primary"
          icon={<FaPlus />}
          onClick={showModal}
        >
          {t('project.main.dbMapping.newTemplate')}
        </Button>
      </div>
    </div>
  );
};
