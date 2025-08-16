export const FeatureCard = ({
  icon: Icon,
  title,
  description,
}: {
  icon: React.ElementType;
  title: string;
  description: string;
}) => {
  return (
    <div className="bg-white bg-opacity-15 backdrop-blur-md rounded-xl p-6 text-center hover:bg-opacity-20 transition-all duration-300 border border-white border-opacity-20">
      <Icon className="w-12 h-12 mx-auto mb-4" />
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-opacity-80 text-sm">{description}</p>
    </div>
  );
};
