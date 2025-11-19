import { useProjectModalContext } from '@app/hooks/useProjectModalContext';
import { Button, Input, Segmented, Select, Space } from 'antd';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FaPlus } from 'react-icons/fa6';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { HiMiniListBullet } from 'react-icons/hi2';
import { IoIosArrowDown } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';

type DashboardHeaderProps = {
  user: {
    given_name: string;
    family_name: string;
  } | null;
  handleLayoutChange: React.Dispatch<React.SetStateAction<'grid' | 'list'>>;
  layout: 'grid' | 'list';
};

export const DashboardHeader = ({ user, handleLayoutChange, layout }: DashboardHeaderProps) => {
  const { showModal } = useProjectModalContext();
  const { t } = useTranslation();
  const handleChange = (value: string | string[]) => {
    console.log(`selected ${value}`);
  };

  return (
    <div className="flex items-center justify-between w-full mt-8 pb-4 border-b border-grey-3">
      <div className="text-xl font-medium font-sans">{user?.given_name + "'s workspace"}</div>
      <div className="flex items-center gap-4 flex-wrap justify-end">
        <Space.Compact className="rounded-lg">
          <Input
            className="px-2 py-1 text-xs font-inter h-8"
            prefix={<IoSearch className="text-grey-1 mr-2" />}
            placeholder="Search projects..."
          />
        </Space.Compact>
        <Select
          className="sort-select text-xs font-medium font-sans w-48"
          prefix="Sort by: "
          defaultValue="date-created"
          suffixIcon={<IoIosArrowDown className="mt-1" />}
          onChange={handleChange}
          options={[
            { value: 'date-created', label: 'Date created' },
            { value: 'title', label: 'Title' },
            { value: 'last-modified', label: 'Last modified' },
          ]}
        />
        <Segmented
          value={layout}
          onChange={(value) => handleLayoutChange(value as 'grid' | 'list')}
          className="bg-grey-3"
          options={[
            { value: 'grid', icon: <HiOutlineViewGrid className="mt-1.5" /> },
            { value: 'list', icon: <HiMiniListBullet className="mt-1.5" /> },
          ]}
        />
        <Button
          className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
          type="primary"
          icon={<FaPlus />}
          onClick={showModal}
        >
          {t('dashboard.main.newProject')}
        </Button>
      </div>
    </div>
  );
};
