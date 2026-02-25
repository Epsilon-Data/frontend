import { Breadcrumb, Button } from 'antd';
import clsx from 'clsx';
import { useTranslation } from 'react-i18next';
import { IoCloseOutline } from 'react-icons/io5';

export type WizardStepHeaderProps = {
  currentStep: number;
  stepTitles: string[];
  onSaveDraft: () => void;
  onExit: () => void;
  saveStatus?: 'idle' | 'saving' | 'saved' | 'error';
};

export const WizardStepHeader = ({
  currentStep,
  stepTitles,
  onSaveDraft,
  onExit,
  saveStatus = 'idle',
}: WizardStepHeaderProps) => {
  const { t } = useTranslation();

  const breadcrumbItems = stepTitles.map((title, index) => ({
    title: (
      <span
        className={clsx(
          'bg-transparent border-none cursor-pointer p-0',
          index === currentStep ? 'text-[#1677ff]' : 'text-grey-2 hover:text-grey-1',
        )}
      >
        {index + 1}. {title}
      </span>
    ),
  }));

  const saveStatusText = () => {
    switch (saveStatus) {
      case 'saving':
        return <span className="text-grey-2 text-xs">{t('project.createTemplate.wizard.saving')}</span>;
      case 'saved':
        return <span className="text-green-600 text-xs">{t('project.createTemplate.wizard.saved')}</span>;
      case 'error':
        return <span className="text-red-500 text-xs">{t('project.createTemplate.wizard.saveFailed')}</span>;
      default:
        return null;
    }
  };

  return (
    <div className="flex items-center justify-between bg-grey-4 h-14 px-4 shrink-0">
      <Breadcrumb separator=">" items={breadcrumbItems} />

      <div className="flex items-center gap-3">
        {saveStatusText()}
        {currentStep > 0 && (
          <Button
            className="flex items-center h-9 border border-grey-3 bg-white text-blueDark text-xs font-medium font-inter"
            onClick={onSaveDraft}
          >
            {t('common.saveDraft')}
          </Button>
        )}
        <Button
          type="text"
          icon={<IoCloseOutline size={20} />}
          className="flex items-center justify-center h-9 w-9 text-grey-1 hover:text-red-500"
          onClick={onExit}
        />
      </div>
    </div>
  );
};
