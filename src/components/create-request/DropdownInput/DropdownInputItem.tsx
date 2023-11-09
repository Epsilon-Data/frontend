import React, { useState } from 'react';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseDropdown } from '@app/components/common/BaseDropdown/Dropdown';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { DownOutlined } from '@ant-design/icons';
import { MenuProps } from 'antd';

export const DropdownInputItem: React.FC<{
  name: string;
  label: string;
  positionItems: {
    key: string;
    label: string;
  }[];
  prompt: string;
}> = ({ name, label, positionItems, prompt }) => {
  const [selectedItem, setSelectedItem] = useState('');
  const handleMenuClick: MenuProps['onClick'] = (e) => {
    const selected = positionItems.find((obj) => obj.key === e.key);
    if (selected) {
      setSelectedItem(selected.label);
    }
  };

  return (
    <BaseButtonsForm.Item name={name} label={label}>
      <BaseDropdown menu={{ items: positionItems, onClick: handleMenuClick }} trigger={['click']}>
        <BaseButton
          onClick={(e) => {
            e.preventDefault();
          }}
        >
          {selectedItem ? selectedItem : prompt} <DownOutlined />
        </BaseButton>
      </BaseDropdown>
    </BaseButtonsForm.Item>
  );
};
