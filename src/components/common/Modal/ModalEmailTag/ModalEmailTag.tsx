import React, { useMemo, useState } from 'react';
import { Form, Select, Tag } from 'antd';
import type { SelectProps } from 'antd';
import type { CustomTagProps } from 'rc-select/lib/BaseSelect';
import { useTranslation } from 'react-i18next';
import { InputLabel } from '../InputLabel/InputLabel';
import { Member } from '@app/api/projects.api';

const normEmail = (s?: string) => (s ?? '').trim().toLowerCase();
const isEmail = (s?: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s ?? '');

export const ModalEmailTag: React.FC<{
  name: string;
  className?: string;
  inputTitle: string;
  inputDescription?: string;
  value: Member[];
  setValue: (value: Member[]) => void;
  labelLarge?: boolean;
  selectProps?: SelectProps<string[]>;
}> = ({ name, className, inputTitle, inputDescription, value, setValue, labelLarge = true, selectProps }) => {
  const { t } = useTranslation();
  const form = Form.useFormInstance();

  const [search, setSearch] = useState<string>('');

  const emails = useMemo(() => value.map((v) => normEmail(v.email)), [value]);
  const normalizedSet = useMemo(() => new Set(emails), [emails]);

  const onInputKeyDown: React.KeyboardEventHandler = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault();
      e.stopPropagation();

      const s = normEmail(search);
      if (!s) return;

      console.log(s);
      console.log(normalizedSet);
      if (normalizedSet.has(s)) {
        form.setFields([{ name, errors: [t('fieldMessages.tags.duplicate')] }]);
        return;
      }

      if (!isEmail(s)) {
        form.setFields([{ name, errors: [t('fieldMessages.tags.invalidEmail')] }]);
        return;
      }

      const nextMembers: Member[] = [...value, { email: s } as Member];
      setValue(nextMembers);
      form.setFields([{ name, errors: [] }]);
      setSearch('');
    }
  };

  const onChange = (nextEmails: string[]) => {
    const nextMembers: Member[] = nextEmails
      .map(normEmail)
      .filter(Boolean)
      .map((e) => {
        const existing = value.find((v) => normEmail(v.email) === e);
        return existing ?? ({ email: e } as Member);
      });
    setValue(nextMembers);
    form.setFields([{ name, errors: [] }]);
  };

  const tagRender = ({ label, closable, onClose }: CustomTagProps) => {
    return (
      <Tag className="rounded-full m-1 px-3 py-1 text-xs" closable={closable} onClose={onClose}>
        {label}
      </Tag>
    );
  };

  return (
    <div className="flex flex-col mb-12">
      <InputLabel inputTitle={inputTitle} inputDescription={inputDescription} large={labelLarge} />
      <Form.Item name={name} className={className}>
        <Select<string[]>
          {...selectProps}
          mode="tags"
          open={false}
          notFoundContent={null}
          value={emails}
          onChange={onChange}
          onInputKeyDown={onInputKeyDown}
          tokenSeparators={[',']}
          onSearch={setSearch}
          suffixIcon={null}
          className="select-field w-full"
          tagRender={tagRender}
        />
      </Form.Item>
    </div>
  );
};
