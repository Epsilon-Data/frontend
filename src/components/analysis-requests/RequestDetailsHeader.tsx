import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { STATUS_COLORS, STATUS_NAMES } from '@app/constants/accessRequest';
import { Button, Skeleton, Tag } from 'antd';
import { StartAnalysisGuide } from './StartAnalysisGuide';

type RequestDetailsHeaderProps = {
  name: string;
  status: string;
};
export const RequestDetailsHeader = ({ name, status }: RequestDetailsHeaderProps) => {
  const { t } = useTranslation();
  const [guideOpen, setGuideOpen] = useState(false);

  return (
    <div className="flex items-center justify-between w-full mt-8 pb-4 border-b border-grey-3">
      <div className="flex gap-4 items-center">
        <div className="text-xl font-medium font-sans">{name ?? <Skeleton active />}</div>
        <Tag color={STATUS_COLORS[status]} className="rounded-2xl py-0.5 px-3">
          {STATUS_NAMES[status]}
        </Tag>
      </div>
      {status === 'APPROVED' && (
        <>
          <Button
            type="primary"
            className="flex items-center h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
            onClick={() => setGuideOpen(true)}
          >
            {t('browse.trackRequests.startAnalysis.button')}
          </Button>
          <StartAnalysisGuide open={guideOpen} onClose={() => setGuideOpen(false)} />
        </>
      )}
    </div>
  );
};
