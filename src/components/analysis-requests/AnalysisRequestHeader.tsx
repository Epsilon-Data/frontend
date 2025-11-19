import { Input, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { IoSearch } from 'react-icons/io5';

export const AnalysisRequestHeader = () => {
  const { t } = useTranslation();

  return (
    <div className="flex items-center justify-between w-full mt-8">
      <div className="text-xl font-medium font-sans">{t('browse.trackRequests.subtitle')}</div>
      <div className="flex items-center gap-4 flex-wrap justify-end">
        <Space.Compact className="rounded-lg">
          <Input
            className="px-2 py-1 text-xs font-inter h-8"
            prefix={<IoSearch className="text-grey-1 mr-2" />}
            placeholder="Search projects..."
          />
        </Space.Compact>
      </div>
    </div>
  );
};
