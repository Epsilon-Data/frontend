import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import { NumberedFormItem } from '@app/components/common/Modal/NumberedFormItem/NumberedFormItem';

type StartAnalysisGuideProps = {
  open: boolean;
  onClose: () => void;
};

const T_PREFIX = 'browse.trackRequests.startAnalysis';

export const StartAnalysisGuide = ({ open, onClose }: StartAnalysisGuideProps) => {
  const { t } = useTranslation();

  const steps = [
    {
      title: t(`${T_PREFIX}.steps.template.title`),
      description: t(`${T_PREFIX}.steps.template.description`),
      link: {
        href: 'https://github.com/Epsilon-Data/epsilon-research-template',
        label: 'Epsilon Research Template',
      },
    },
    {
      title: t(`${T_PREFIX}.steps.clone.title`),
      description: t(`${T_PREFIX}.steps.clone.description`),
    },
    {
      title: t(`${T_PREFIX}.steps.setup.title`),
      description: t(`${T_PREFIX}.steps.setup.description`),
    },
    {
      title: t(`${T_PREFIX}.steps.init.title`),
      description: t(`${T_PREFIX}.steps.init.description`),
    },
    {
      title: t(`${T_PREFIX}.steps.build.title`),
      description: t(`${T_PREFIX}.steps.build.description`),
    },
    {
      title: t(`${T_PREFIX}.steps.workspace.title`),
      description: t(`${T_PREFIX}.steps.workspace.description`),
      link: {
        href: 'https://analysis.epsilon-data.org',
        label: 'Epsilon Analysis Hub',
      },
    },
    {
      title: t(`${T_PREFIX}.steps.submit.title`),
      description: t(`${T_PREFIX}.steps.submit.description`),
    },
  ];

  return (
    <Modal
      title={t(`${T_PREFIX}.title`)}
      open={open}
      onCancel={onClose}
      footer={null}
      width={640}
      styles={{
        header: { padding: '16px 32px 0' },
        body: { maxHeight: '70vh', overflowY: 'auto', padding: 0 },
      }}
    >
      <div className="py-6 px-8">
        {steps.map((step, index) => (
          <NumberedFormItem key={index} number={index + 1} showDivider={index < steps.length - 1}>
            <div className="mb-6">
              <div className="font-semibold text-base mb-1">{step.title}</div>
              <p className="text-sm text-grey-5 mb-0">{step.description}</p>
              {step.link && (
                <a
                  href={step.link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-primary underline"
                >
                  {step.link.label}
                </a>
              )}
            </div>
          </NumberedFormItem>
        ))}
      </div>
    </Modal>
  );
};
