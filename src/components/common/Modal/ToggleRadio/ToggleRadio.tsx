import { Radio } from 'antd';

export function ToggleRadio({
  checked,
  disabled,
  onChange,
}: {
  checked: boolean;
  disabled?: boolean;
  onChange: (next: boolean) => void;
}) {
  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (disabled) return;
    onChange(!checked);
  };

  return <Radio checked={checked} disabled={disabled} onClick={handleClick} />;
}
