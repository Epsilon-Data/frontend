import { Panel } from '@xyflow/react';
import { Button } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';

type GenerateArchetypeLabelProps = {
  onGenerateFromCodebook?: () => void;
};

const GenerateArchetypeLabel: React.FC<GenerateArchetypeLabelProps> = ({ onGenerateFromCodebook }) => {
  const { t } = useTranslation();

  return (
    <Panel position="top-right">
      <div
        className={[
          'flex items-center bg-white border border-[#ddd] rounded-lg text-base shadow-xl',
          'transition-transform duration-500 ease-in-out',
        ].join(' ')}
      >
        <Button className="border-none bg-transparent shadow-none" onClick={onGenerateFromCodebook}>
          {t('project.createTemplate.form.step2.generateFromCodebook.label')}
        </Button>
      </div>
    </Panel>
  );
};

export default GenerateArchetypeLabel;
