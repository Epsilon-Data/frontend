import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import { Select } from 'antd';

const MAX_COUNT = 6;

export const ModalTagInput: React.FC<{
  name: string;
  className?: string;
  inputTitle: string;
  inputDescription?: string;
  value: string[];
  setValue: (value: string[]) => void;
}> = ({ name, className, inputTitle, inputDescription, value, setValue }) => {
  return (
    <div className="flex flex-col mb-12">
      <div className="mb-8">
        <div className="font-medium font-sans text-blueDark text-xl">{inputTitle}</div>
        <div className="font-light font-inter text-black text-xs">{inputDescription}</div>
      </div>
      <FormItem
        name={name}
        className={className}
        rules={[
          {
            validator: (_, val: string[]) => {
              if (val && val.length >= 2) {
                return Promise.resolve();
              }
              return Promise.reject(new Error('Please enter at least 2 keywords'));
            },
          },
        ]}
      >
        <Select
          mode="tags"
          maxCount={MAX_COUNT}
          value={value}
          onChange={setValue}
          suffixIcon={null}
          className="tag-select w-full"
        />
      </FormItem>
      <div className="flex flex-between text-xs font-normal font-inter">
        <span>Separate each one with a comma &nbsp;</span>
        <span>
          {value.length} / {MAX_COUNT}
        </span>
      </div>
    </div>
  );
};
