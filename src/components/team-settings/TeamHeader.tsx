import { Input, Space } from 'antd';
import { useTranslation } from 'react-i18next';
import { IoSearch } from 'react-icons/io5';

type TeamHeaderProps = {
  projectName: string;
  numberOfMembers: number;
};

export const TeamHeader = ({ projectName, numberOfMembers }: TeamHeaderProps) => {
  const { t } = useTranslation();
  return (
    <div className="flex items-center justify-between w-full mt-8">
      <div className="flex items-center mt-4 mb-8">
        <span className="text-xl font-medium font-sans">{projectName}</span>
        <span className="text-sm ml-3 font-normal font-inter text-grey-2 pt-1.5">
          {t('project.main.team.number', { number: numberOfMembers })}
        </span>
      </div>
      <div className="flex items-center gap-4 flex-wrap justify-end">
        <Space.Compact className="rounded-lg">
          <Input
            className="px-2 py-1 text-xs font-inter h-8"
            prefix={<IoSearch className="text-grey-1 mr-2" />}
            placeholder="Search requests..."
          />
        </Space.Compact>
      </div>
    </div>
  );
};
