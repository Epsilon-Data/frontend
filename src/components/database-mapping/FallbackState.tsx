import { Trans, useTranslation } from 'react-i18next';
import { FaCheck } from 'react-icons/fa6';

type FallbackStateProps = {
  projectStatus: string;
};

export const FallbackState = ({ projectStatus }: FallbackStateProps) => {
  const { t } = useTranslation();

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
      </div>
    </div>
  );
};
