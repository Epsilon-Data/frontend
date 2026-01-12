// DatabaseMappingNotReadyState.tsx
import React from 'react';
import { useTranslation } from 'react-i18next';

type NotReadyStateProps = {
  projectStatus: string;
};

export const NotReadyState = ({ projectStatus }: NotReadyStateProps) => {
  const { t } = useTranslation();

  return (
    <div className="relative mt-6 overflow-hidden bg-grey-4 min-h-[500px]">
      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <div className="text-2xl md:text-3xl font-medium text-grey-9">
          {t(`project.main.dbMapping.notReady.${projectStatus.toLowerCase()}.title`)}
        </div>
        <div className="mt-2 text-sm md:text-base text-grey-7">
          {t(`project.main.dbMapping.notReady.${projectStatus.toLowerCase()}.description`)}
        </div>
      </div>
    </div>
  );
};
