import { BaseButtonsForm } from '@app/components/common/forms/BaseButtonsForm/BaseButtonsForm';
import { BaseSelect } from '@app/components/common/selects/BaseSelect/BaseSelect';

export const SelectInputItem: React.FC<{
  name: string;
  label?: string;
  optionItems: {
    value: string;
    label: string;
  }[];
  prompt: string;
  required?: boolean;
  mode?: 'multiple' | 'tags' | undefined;
}> = ({ name, label, optionItems, prompt, required, mode }) => {
  return (
    <BaseButtonsForm.Item name={name} label={label} rules={[{ required: required }]} style={{ marginBottom: '2rem' }}>
      <BaseSelect mode={mode} width={120} placeholder={prompt} options={optionItems} />
    </BaseButtonsForm.Item>
  );
};
