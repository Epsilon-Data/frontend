import React from 'react';
import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseDropdown } from '@app/components/common/BaseDropdown/Dropdown';
import { BaseButton } from '@app/components/common/BaseButton/BaseButton';
import { DownOutlined } from '@ant-design/icons';

export const DropdownInputItem: React.FC<{
  name: string;
  label: string;
  positionItems: {
    key: string;
    label: string;
  }[];
  prompt: string;
}> = ({ name, label, positionItems, prompt }) => {
  return (
    <BaseButtonsForm.Item name={name} label={label}>
      <BaseDropdown menu={{ items: positionItems }} trigger={['click']}>
        <BaseButton onClick={(e) => e.preventDefault()}>
          {prompt} <DownOutlined />
        </BaseButton>
      </BaseDropdown>
    </BaseButtonsForm.Item>
  );
};
