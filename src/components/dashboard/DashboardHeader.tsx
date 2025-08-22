import { Button, Input, Radio, Select, Space } from 'antd';
import React from 'react';
import { FaPlus } from 'react-icons/fa6';
import { HiOutlineViewGrid } from 'react-icons/hi';
import { HiMiniListBullet } from 'react-icons/hi2';
import { IoIosArrowDown } from 'react-icons/io';
import { IoSearch } from 'react-icons/io5';

export const DashboardHeader = ({ user, showModal, handleChange, handleLayoutChange, layout }) => {
  return (
    <div className="flex items-center justify-between w-full mt-8 pb-4 border-b border-grey-3">
      <div className="text-xl font-medium font-sans">{user?.firstName + "'s workspace"}</div>
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
        <Space>
          <Radio.Group
            value={layout}
            onChange={(e) => handleLayoutChange(e.target.value)}
            className="flex bg-grey-3 rounded-md p-1 gap-1"
          >
            <Radio.Button value="grid" className="flex items-center rounded-r-md z-2">
              <HiOutlineViewGrid />
            </Radio.Button>
            <Radio.Button value="list" className="flex items-center rounded-l-md z-2 border">
              <HiMiniListBullet />
            </Radio.Button>
          </Radio.Group>
        </Space>
        <Button
          className="flex items-center w-80 h-9 text-xs font-medium font-inter bg-gradient-to-br from-primaryGradientFrom to-primaryGradientTo text-white hover:text-white"
          type="primary"
          icon={<FaPlus />}
          onClick={showModal}
        >
          {/* {t('dashboard.main.newProject')} */}
        </Button>
      </div>
    </div>
  );
};
