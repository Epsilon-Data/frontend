import React, { useMemo, useState } from 'react';
import FormItem from 'antd/es/form/FormItem';
import { Form, Select, SelectProps, Tag } from 'antd';
import { useTranslation } from 'react-i18next';
import { InputLabel } from '../InputLabel/InputLabel';
import { CustomTagProps } from 'rc-select/lib/BaseSelect';

const norm = (s: string) => s.trim().toLowerCase();
const isEmail = (s: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s);

export const ModalEmailTag: React.FC<{
  name: string;
  className?: string;
  inputTitle: string;
  inputDescription?: string;
  value: string[];
  setValue: (value: string[]) => void;
  labelLarge?: boolean;
  selectProps?: SelectProps;
}> = ({ name, className, inputTitle, inputDescription, value, setValue, labelLarge = true, selectProps }) => {
  const { t } = useTranslation();
  const [search, setSearch] = useState('');
  const form = Form.useFormInstance();
  const normalizedSet = useMemo(() => new Set(value.map(norm)), [value]);

  const onInputKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      e.stopPropagation();

      const s = norm(search);
      if (!s) return;

      if (normalizedSet.has(s)) {
        form.setFields([{ name, errors: [t('fieldMessages.tags.duplicate')] }]);
        return;
      }

      if (!isEmail(s)) {
        form.setFields([{ name, errors: [t('fieldMessages.tags.invalidEmail')] }]);
        return;
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
      <InputLabel inputTitle={inputTitle} inputDescription={inputDescription} large={labelLarge} />
      <FormItem name={name} className={className}>
        <Select
          {...selectProps}
          mode="tags"
          open={false}
          notFoundContent={null}
          value={value}
          onChange={setValue}
          onInputKeyDown={onInputKeyDown}
          tokenSeparators={[',']}
          onSearch={setSearch}
          suffixIcon={null}
          className="select-field w-full"
          tagRender={tagRender}
        />
      </FormItem>
    </div>
  );
};
