import { ReactNode } from 'react';

type NumberedFormItemProps = {
  number: number;
  children: ReactNode;
  showDivider?: boolean;
};

export const NumberedFormItem = ({ number, children, showDivider = true }: NumberedFormItemProps) => {
  return (
    <div className="flex flex-col">
      <div className="flex items-start gap-4">
        <span className="font-bold text-blueDark text-2xl min-w-6">{number}</span>
        <div className="flex-1">{children}</div>
      </div>
      {showDivider && <hr className="mb-8 border-grey-2" />}
    </div>
  );
};
