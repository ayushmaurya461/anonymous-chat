type Props = {
  message: string;
};

export const EmptyState = ({ message }: Props) => (
  <div className="bg-teal-600 bg-opacity-20 backdrop-blur-sm rounded-xl p-6 text-center border border-teal-500 border-opacity-30">
    <div className="text-teal-100 text-sm font-medium">{message}</div>
  </div>
);
