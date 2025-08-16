import type { ReactNode } from "react";
import { Button } from "./Button";

type ActionCardProps = {
  icon: ReactNode;
  title: string;
  description: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  buttonText: string;
  onButtonClick: () => void;
};

export const ActionCard = ({
  icon,
  title,
  description,
  placeholder,
  value,
  onChange,
  buttonText,
  onButtonClick,
}: ActionCardProps) => {
  return (
    <div className="bg-white bg-opacity-20 backdrop-blur-md rounded-2xl p-8 border border-white border-opacity-30 shadow-xl">
      <div className="flex items-center mb-4">
        {icon}
        <h3 className="text-xl font-semibold ml-3">{title}</h3>
      </div>
      <p className="text-opacity-80 mb-6 text-sm">{description}</p>
      <div className="flex flex-wrap gap-3">
        <input
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className="flex-1 min-w-[150px] px-4 py-3 rounded-xl bg-white bg-opacity-20 border border-gray-300 border-opacity-30 placeholder-white placeholder-opacity-70 focus:outline-none focus:ring-2 focus:ring-white focus:ring-opacity-50 backdrop-blur-sm"
        />
        <Button
          onClick={onButtonClick}
          className="shrink-0 px-6 py-3 w-full sm:w-auto"
        >
          {buttonText}
        </Button>
      </div>
    </div>
  );
};
