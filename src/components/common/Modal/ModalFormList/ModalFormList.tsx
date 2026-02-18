import React from 'react';
import { Button, Col, Form, Input, InputProps, Row, Select, message } from 'antd';
import { FaChevronDown, FaPlus } from 'react-icons/fa6';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FormInstance } from 'antd/lib';
import { useTranslation } from 'react-i18next';
import { InputLabel } from '../InputLabel/InputLabel';

const roles = [
  { label: 'Collaborator', value: 'Collaborator' },
  { label: 'Admin', value: 'Admin' },
];

export const ModalFormList: React.FC<{
  name: string;
  inputTitle: string;
  inputDescription?: string;
  form: FormInstance;
  inputProps?: InputProps;
}> = ({ name, inputTitle, inputDescription, form, inputProps }) => {
  const { t } = useTranslation();

  const members: { email?: string; role?: string }[] = Form.useWatch(name, form) || [];

  const normalizeEmail = (email?: string) => (email ?? '').trim().toLowerCase();

  const findFirstEmptyRowIndex = () => members.findIndex((m) => !normalizeEmail(m?.email));

  const uniqueEmailValidator = (_: unknown, value: string) => {
    const v = normalizeEmail(value);
    if (!v) return Promise.resolve();

    const all = (members || []).map((m) => normalizeEmail(m?.email)).filter(Boolean);
    const occurrences = all.filter((e) => e === v).length;

    return occurrences > 1 ? Promise.reject(t('dashboard.createProject.form.error.duplicateEmail')) : Promise.resolve();
  };

  const clearEmailError = (rowIndex: number) => {
    form.setFields([{ name: [name, rowIndex, 'email'], errors: [] }]);
  };

  const validateFilledEmails = async () => {
    const emailFieldPaths = (members || [])
      .map((m, idx) => ({ idx, email: normalizeEmail(m?.email) }))
      .filter((x) => Boolean(x.email))
      .map((x) => [name, x.idx, 'email']);

    if (emailFieldPaths.length === 0) return;

    await form.validateFields(emailFieldPaths);
  };

  const handleAddMemberClick = async (
    add: (defaultValue?: { email: string; role: string }, insertIndex?: number) => void,
  ) => {
    const emptyIdx = findFirstEmptyRowIndex();

    if (emptyIdx !== -1) {
      form.setFields([
        {
          name: [name, emptyIdx, 'email'],
          errors: [t('dashboard.createProject.form.error.emailRequired')],
        },
      ]);
      return;
    }

    try {
      await validateFilledEmails();

      add({ email: '', role: 'Collaborator' });
    } catch {
      message.error(t('dashboard.createProject.form.error.invalidEmail'));
    }
  };

  return (
    <div className="flex flex-col mb-12">
      <InputLabel inputTitle={inputTitle} inputDescription={inputDescription} />

      <Form.List name={name} initialValue={[{ email: '', role: 'Collaborator' }]}>
        {(fields, { add, remove }) => (
          <>
            {fields.map((field, index) => {
              return (
                <div key={field.key}>
                  <Row className="flex" align="middle">
                    <Col span={17} className="flex-1">
                      <p className="mb-0.3 text-xs">{t('dashboard.createProject.form.step1.members.emailAddress')}</p>
                      <Form.Item
                        name={[field.name, 'email']}
                        rules={[
                          { type: 'email', message: t('fieldMessages.input.email') },
                          { validator: uniqueEmailValidator },
                        ]}
                      >
                        <Input
                          {...inputProps}
                          className="w-full border border-grey-3 bg-grey-4 [&::placeholder]:text-grey-2"
                          onChange={() => {
                            clearEmailError(index);
                          }}
                        />
                      </Form.Item>
                    </Col>
                    <Col span={6} className="flex-1 ml-1">
                      <p className="mb-0.3 text-xs">{t('dashboard.createProject.form.step1.members.role')}</p>
                      <Form.Item name={[field.name, 'role']} initialValue="Collaborator" rules={[{ required: true }]}>
                        <Select
                          data-testid={`role-select-${index}`}
                          className="select-field w-full"
                          suffixIcon={<FaChevronDown />}
                          options={roles}
                        />
                      </Form.Item>
                    </Col>
                    <Col className="ml-1 flex items-center justify-center">
                      <Button
                        type="text"
                        aria-label={t('common.delete')}
                        icon={<RiDeleteBinLine size={20} />}
                        onClick={() => {
                          if (members.length > 1) {
                            remove(field.name);
                          } else {
                            form.setFieldValue([name, index, 'email'], '');
                            clearEmailError(index);
                          }
                        }}
                        className="text-grey-1"
                      />
                    </Col>
                  </Row>
                </div>
              );
            })}

            <Button
              data-testid="add-member"
              icon={<FaPlus />}
              className="mt-2 self-start bg-black border-none text-white !hover:bg-black"
              onClick={() => handleAddMemberClick(add)}
            >
              {t('dashboard.createProject.form.step1.members.addMember')}
            </Button>
          </>
        )}
      </Form.List>

      <div className="font-light font-inter text-grey-1 text-sm italic mt-8">
        {t('dashboard.createProject.form.step1.members.helperText')}
      </div>
    </div>
  );
};
