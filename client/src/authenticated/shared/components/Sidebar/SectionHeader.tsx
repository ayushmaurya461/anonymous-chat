import { ChevronDown } from "lucide-react";

type Props = {
  title: string;
  icon: React.ElementType;
  expanded: boolean;
  onToggle: () => void;
  count?: number;
};

export const SectionHeader = ({
  title,
  icon: Icon,
  expanded,
  onToggle,
  count,
}: Props) => (
  <button
    onClick={onToggle}
    className="w-full flex items-center justify-between cursor-pointer text-teal-100 mb-4 p-3 rounded-xl hover:bg-teal-600 hover:bg-opacity-40 transition-all duration-200 group"
  >
    <div className="flex items-center space-x-3">
      <div className="p-2 rounded-lg bg-teal-600 bg-opacity-50 group-hover:bg-teal-500 transition">
        <Icon className="w-4 h-4 text-teal-100" />
      </div>
      <span className="font-semibold text-sm text-teal-100">{title}</span>
      {count && count > 0 && (
        <span className="bg-orange-400 text-orange-900 text-xs px-2 py-0.5 rounded-full font-bold">
          {count}
        </span>
      )}
    </div>
    <div
      className={`transform transition-transform duration-200 ${
        expanded ? "rotate-0" : "-rotate-90"
      }`}
    >
      <ChevronDown className="w-4 h-4 text-teal-200" />
    </div>
  </button>
);
