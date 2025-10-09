type InputLabelProps = {
  inputTitle: string;
  inputDescription?: string;
  large?: boolean;
};

export const InputLabel: React.FC<InputLabelProps> = ({ inputTitle, inputDescription, large = true }) => {
  return large ? (
    <div className="mb-8">
      <div className="font-medium font-sans text-grey-1 text-lg">{inputTitle}</div>
      <div className="font-light font-inter text-grey-1 text-sm">{inputDescription}</div>
    </div>
  ) : (
    <div className="mb-2">
      <div className="font-medium font-sans text-grey-1 text-sm">{inputTitle}</div>
    </div>
  );
};
