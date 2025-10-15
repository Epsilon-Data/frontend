import { FlowMode } from '@app/context/ArchetypeFlow';
import { Typography } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

type Props = {
  mode: FlowMode;
};

export const InformationPanel: React.FC<Props> = ({ mode }) => {
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
        'mb-4 border border-[#ddd] p-3 translate-x-0 opacity-100',
      ].join(' ')}
    >
      <div className="text-sm text-start mb-2">{t('project.createTemplate.form.step2.sidebar.instructions.title')}</div>
      {instructions.map((item, idx) => (
        <div key={idx} className="font-light text-gray text-xs pb-2">
          {item}
        </div>
      ))}
      <div className="flex flex-col items-start mt-2 bg-yellow-200 p-2 rounded">
        {mode == 'editable' && (
          <>
            <Text className="font-bold text-gray text-xs">
              {t('project.createTemplate.form.step2.sidebar.instructions.warning.title')}
            </Text>
            <Text className="font-light text-gray text-xs">
              {t('project.createTemplate.form.step2.sidebar.instructions.warning.content')}
            </Text>
          </>
        )}
      </div>
    </div>
  );
};
