export const InputLabel: React.FC<{ inputTitle: string; inputDescription?: string }> = ({
  inputTitle,
  inputDescription,
}) => {
  return (
    <div className="mb-8">
      <div className="font-medium font-sans text-grey-1 text-lg">{inputTitle}</div>
      <div className="font-light font-inter text-grey-1 text-sm">{inputDescription}</div>
    </div>
  );
};
