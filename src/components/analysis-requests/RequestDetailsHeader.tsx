import { STATUS_COLORS, STATUS_NAMES } from '@app/constants/analysisRequest';
import { Skeleton, Tag } from 'antd';

type RequestDetailsHeaderProps = {
  name: string;
  status: string;
};
export const RequestDetailsHeader = ({ name, status }: RequestDetailsHeaderProps) => {
  return (
    <div className="flex items-start w-full mt-8 pb-4 border-b border-grey-3">
      <div className="flex gap-4 items-center">
        <div className="text-xl font-medium font-sans">{name ?? <Skeleton active />}</div>
        <Tag color={STATUS_COLORS[status]} className="rounded-2xl py-0.5 px-3">
          {STATUS_NAMES[status]}
        </Tag>
      </div>
    </div>
  );
};
