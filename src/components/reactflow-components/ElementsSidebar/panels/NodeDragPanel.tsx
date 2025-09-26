import React from 'react';
import { Typography } from 'antd';
import { useTranslation } from 'react-i18next';
import { PiLightbulbBold } from 'react-icons/pi';
import { TiWarningOutline } from 'react-icons/ti';

type Props = {
  hidden: boolean;
  onDragStart: (e: React.DragEvent<HTMLDivElement>, type: string) => void;
};

export const NodeDragPanel: React.FC<Props> = ({ hidden, onDragStart }) => {
  const { Text } = Typography;
  const { t } = useTranslation();

  return (
    <div
      className={[
        'flex flex-col bg-white rounded-lg w-60 shadow-xl',
        'transition-all duration-500 ease-in-out will-change-transform origin-left',
        hidden
          ? 'mb-0 border-0 p-0 opacity-0 pointer-events-none'
          : 'mb-4 border border-[#ddd] p-3 translate-x-0 opacity-100',
      ].join(' ')}
      aria-hidden={hidden}
    >
      <div className="text-sm text-start mb-2">{t('project.createTemplate.form.step2.sidebar.blocks')}</div>

      <div
        className="dndnode object bg-element-categoryBg text-center mb-2 rounded-lg py-2 w-5/6 text-white"
        onDragStart={(e) => onDragStart(e, 'category')}
        draggable
      >
        {t('project.createTemplate.form.step2.sidebar.category')}
      </div>

      <div
        className="dndnode object bg-element-subcategoryBg text-center mb-2 rounded-lg py-2 w-5/6 text-white"
        onDragStart={(e) => onDragStart(e, 'subcategory')}
        draggable
      >
        {t('project.createTemplate.form.step2.sidebar.subcategory')}
      </div>

      <div className="text-sm text-start my-2">{t('project.createTemplate.form.step2.sidebar.rules')}</div>
      <div className="font-light text-gray text-xs pb-0">
        <Text className="font-bold text-blueDark mr-2">•</Text> Parent → Category
      </div>
      <div className="font-light text-gray text-xs">
        <Text className="font-bold text-blueDark mr-2">•</Text> Category → Sub-category
      </div>
      <div className="flex items-center mt-2">
        <TiWarningOutline size={18} className="text-red-500 mr-2" />
        <Text className="font-light text-gray text-xs">No direct parent → Sub-category</Text>
      </div>
      <div className="flex items-center mt-2">
        <PiLightbulbBold size={30} className="text-[#1890ff] mr-2" />
        <Text className="font-light text-gray text-xs">
          Press Alt/Option key while dragging to duplicate an element
        </Text>
      </div>
    </div>
  );
};
