import React from 'react';
import FormItem from 'antd/es/form/FormItem';
import { FaChevronDown, FaPlus } from 'react-icons/fa6';
import { Button, Col, Input, Row, Select, Tag, message } from 'antd';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FormInstance } from 'antd/lib';
import { RuleObject } from 'antd/es/form';

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
}> = ({ inputTitle, inputDescription, members, setMembers, form }) => {
  const emailRules: RuleObject[] = [
    {
      type: 'email',
      message: 'The input is not a valid email',
    },
  ];

  const handleAdd = async () => {
    const { email, role } = form.getFieldsValue(['email', 'role']);
    try {
      await form.validateFields(['email']);
      setMembers([...members, { email, role }]);
    } catch (errorInfo) {
      message.error("Invalid team member's email");
    }
  };

  const handleRemove = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col mb-12">
      <div className="mb-2">
        <div className="text-xl font-medium font-sans text-blueDark">{inputTitle}</div>
        <div className="text-xs font-light font-inter">{inputDescription}</div>
      </div>
      <Row className="flex">
        <Col span={17} className="flex-1">
          <p className="mb-0.3 text-xs">Email address</p>
          <FormItem name="email" rules={emailRules}>
            <Input className="w-full border border-black bg-grey-4" />
          </FormItem>
        </Col>
        <div className="h-2 bg-grey-2" />
        <Col span={6} className="flex-1 ml-1">
          <p className="mb-0.3 text-xs">Role</p>
          <FormItem name="role">
            <Select className="role-select w-full" suffixIcon={<FaChevronDown />} options={roles} />
          </FormItem>
        </Col>
        <Col>
          <Button className="mt-4 ml-1 bg-black border-none text-white !hover:bg-black" onClick={handleAdd}>
            <FaPlus />
          </Button>
        </Col>
      </Row>
      <div className="h-[0.1rem] bg-grey-2" />
      {members.map((member, index) => (
        <div key={index} className="flex justify-between mt-4">
          <div className="text-xs font-normal text-inter">{`${index + 1}. ${member.email}`}</div>
          <div className="flex items-center gap-6 mr-1">
            <Tag bordered={false} color="default">
              {member.role}
            </Tag>
            <RiDeleteBinLine size={20} className="cursor-pointer" onClick={() => handleRemove(index)} />
          </div>
        </div>
      ))}
    </div>
  );
};
