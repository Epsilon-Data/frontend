import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import { FaChevronDown, FaPlus } from 'react-icons/fa6';
import { Button, Col, Input, InputProps, Row, Select, Tag, message } from 'antd';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FormInstance } from 'antd/lib';
import { RuleObject } from 'antd/es/form';
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
  members: { email: string; role: string }[];
  form: FormInstance;
  setMembers: (members: { email: string; role: string }[]) => void;
  inputProps?: InputProps;
}> = ({ inputTitle, inputDescription, members, setMembers, form, inputProps }) => {
  const { t } = useTranslation();
  const emailRules: RuleObject[] = [
    {
      type: 'email',
      message: t('fieldMessages.input.email'),
    },
  ];

  const handleAdd = async () => {
    const { email, role } = form.getFieldsValue(['email', 'role']);
    try {
      await form.validateFields(['email']);
      if (!email || !role) {
        throw new Error();
      }
      setMembers([...members, { email, role }]);
    } catch {
      message.error(t('dashboard.createProject.form.error.invalidEmail'));
    }
  };

  const handleRemove = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col mb-12">
      <InputLabel inputTitle={inputTitle} inputDescription={inputDescription} />
      <Row className="flex">
        <Col span={17} className="flex-1">
          <p className="mb-0.3 text-xs">{t('dashboard.createProject.form.step1.members.emailAddress')}</p>
          <FormItem name="email" rules={emailRules}>
            <Input {...inputProps} className="w-full border border-grey-3 bg-grey-4 [&::placeholder]:text-grey-2" />
          </FormItem>
        </Col>
        <div className="h-2 bg-grey-2" />
        <Col span={6} className="flex-1 ml-1">
          <p className="mb-0.3 text-xs">{t('dashboard.createProject.form.step1.members.role')}</p>
          <FormItem name="role" initialValue="Collaborator">
            <Select
              data-testid="role-select"
              className="select-field w-full"
              suffixIcon={<FaChevronDown />}
              options={roles}
            />
          </FormItem>
        </Col>
        <Col>
          <Button
            data-testid="add-member"
            className="mt-4 ml-1 bg-black border-none text-white !hover:bg-black"
            onClick={handleAdd}
          >
            <FaPlus />
          </Button>
        </Col>
      </Row>
      <div className="h-[0.1rem] bg-grey-2" />
      {members.map((member, index) => (
        <div key={index} className="flex justify-between mt-4">
          <div className="text-xs font-normal text-inter">{`${index + 1}. ${member.email}`}</div>
          <div className="flex items-center gap-6 mr-1">
            <Tag variant="filled" color="default">
              {member.role}
            </Tag>
            <RiDeleteBinLine size={20} className="cursor-pointer" onClick={() => handleRemove(index)} />
          </div>
        </div>
      ))}
    </div>
  );
};
