import { Checkbox } from 'antd';

export function ToggleCheckbox({
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

  return <Checkbox checked={checked} disabled={disabled} onClick={handleClick} />;
}
