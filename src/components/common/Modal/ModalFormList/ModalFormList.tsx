import React from 'react';
import * as S from './ModalFormList.styles';
import FormItem from 'antd/es/form/FormItem';
import { FaChevronDown, FaPlus } from 'react-icons/fa6';
import { Col, Tag } from 'antd';
import { FONT_SIZE } from '@app/styles/themes/constants';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FormInstance } from 'antd/lib';

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
  const handleAdd = () => {
    const { email, role } = form.getFieldsValue(['email', 'role']);
    setMembers([...members, { email, role }]);
  };

  const handleRemove = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '3rem' }}>
      <div style={{ marginBottom: '2rem' }}>
        <S.InputTitle>{inputTitle}</S.InputTitle>
        <S.InputDescription>{inputDescription}</S.InputDescription>
      </div>
      <S.EmailWrapper>
        <Col span={17} style={{ flex: 1 }}>
          <p style={{ marginBottom: '0.3rem', fontSize: FONT_SIZE.xs }}>Email address</p>
          <FormItem name="email">
            <S.EmailInput style={{ border: '1px solid var(--black)', background: 'var(--grey4)' }} />
          </FormItem>
        </Col>
        <S.HorizontalLine />
        <Col span={6} style={{ flex: 1, marginLeft: '1rem' }}>
          <p style={{ marginBottom: '0.3rem', fontSize: FONT_SIZE.xs }}>Role</p>
          <FormItem name="role">
            <S.RoleSelect suffixIcon={<FaChevronDown />} options={roles} />
          </FormItem>
        </Col>
        <Col>
          <S.AddButton onClick={handleAdd}>
            <FaPlus />
          </S.AddButton>
        </Col>
      </S.EmailWrapper>
      <S.HorizontalLine />
      {members.map((member, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginTop: '1rem' }}>
          <S.Text>{`${index + 1}. ${member.email}`}</S.Text>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6rem', marginRight: '1rem' }}>
            <Tag bordered={false} color="default">
              {member.role}
            </Tag>
            <RiDeleteBinLine size={20} style={{ cursor: 'pointer' }} onClick={() => handleRemove(index)} />
          </div>
        </div>
      ))}
    </div>
  );
};
