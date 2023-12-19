import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';

export const SelectInputItem: React.FC<{
  name: string;
  label: string;
  optionItems: {
    value: string;
    label: string;
  }[];
  prompt: string;
  required?: boolean;
}> = ({ name, label, optionItems, prompt, required }) => {
  return (
    <BaseButtonsForm.Item name={name} label={label} rules={[{ required: required }]} style={{ marginBottom: '2rem' }}>
      <BaseSelect width={120} placeholder={prompt} options={optionItems} />
    </BaseButtonsForm.Item>
  );
};
