export const TemplateNamePanel: React.FC<{ name: string }> = ({ name }) => {
  return (
    <div className="flex text-start bg-white border border-[#ddd] rounded-lg text-base p-3 w-60 mb-4 shadow-xl">
      {name}
    </div>
  );
};
