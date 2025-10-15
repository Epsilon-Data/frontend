import { Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TiWarningOutline } from 'react-icons/ti';

type Props = {
  hidden: boolean;
};

export const InformationPanel: React.FC<Props> = ({ hidden }) => {
  const { Text } = Typography;
  const { t } = useTranslation();
  const instructions: string[] = t('project.createTemplate.form.step2.sidebar.instructions.content', {
    returnObjects: true,
  });

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
      <div className="text-sm text-start mb-2">{t('project.createTemplate.form.step2.sidebar.instructions.title')}</div>
      {instructions.map((item, idx) => (
        <div key={idx} className="font-light text-gray text-xs pb-2">
          {item}
        </div>
      ))}
      <div className="flex items-center mt-2">
        <TiWarningOutline size={18} className="text-red-500 mr-2" />
        <Text className="font-light text-gray text-xs">
          {t('project.createTemplate.form.step2.sidebar.instructions.warning')}
        </Text>
      </div>
    </div>
  );
};
