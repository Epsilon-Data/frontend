import React, { useMemo, useState } from 'react';
import FormItem from 'antd/es/form/FormItem';
import { Form, Select, SelectProps, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { InputLabel } from '../InputLabel/InputLabel';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';

const MAX_COUNT = 5;
const norm = (s: string) => s.trim().toLowerCase();

export const ModalTagInput: React.FC<{
  name: string;
  className?: string;
  inputTitle: string;
  inputDescription?: string;
  value: string[];
  setValue: (value: string[]) => void;
  selectProps?: SelectProps;
}> = ({ name, className, inputTitle, inputDescription, value, setValue, selectProps }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const form = Form.useFormInstance();
  const normalizedSet = useMemo(() => new Set(value.map(norm)), [value]);

  const onInputKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      const s = norm(search);
      if (s && normalizedSet.has(s)) {
        e.preventDefault();
        e.stopPropagation();
        form.setFields([{ name, errors: [t('fieldMessages.tags.duplicate')] }]);
      }
    }
  };

  const tagRender = (props: CustomTagProps) => {
    const { label, closable, onClose } = props;
    return (
      <Tag className="rounded-full m-1 px-3 py-1 text-xs" closable={closable} onClose={onClose}>
        {label}
      </Tag>
    );
  };

  return (
    <div className="flex flex-col mb-12">
      <InputLabel inputTitle={inputTitle} inputDescription={inputDescription} />
      <FormItem
        name={name}
        className={className}
        rules={[
          {
            validator: (_, val: string[]) => {
              if (val && val.length >= 2) {
                return Promise.resolve();
              }
              return Promise.reject(new Error(t('fieldMessages.tags.min', { min: 2 })));
            },
          },
        ]}
      >
        <Select
          {...selectProps}
          mode="tags"
          open={false}
          notFoundContent={null}
          maxCount={MAX_COUNT}
          value={value}
          onChange={setValue}
          tokenSeparators={[',']}
          onSearch={setSearch}
          onInputKeyDown={onInputKeyDown}
          suffixIcon={null}
          tagRender={tagRender}
          className="select-field w-full"
        />
      </FormItem>
      <div className="flex flex-between text-xs font-normal font-inter">
        <span>{t('fieldMessages.tags.instruction')} &nbsp;</span>
        <span>
          {value.length} / {MAX_COUNT}
        </span>
      </div>
    </div>
  );
};
