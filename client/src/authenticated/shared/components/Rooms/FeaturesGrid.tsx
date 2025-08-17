import React from "react";

interface Feature {
  icon: React.ElementType;
  title: string;
  description: string;
}

export const FeaturesGrid = ({ features }: { features: Feature[] }) => (
  <div className="grid md:grid-cols-3 gap-6 mb-12">
    {features.map((feature, index) => (
      <div
        key={index}
        className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
      >
        <div className="flex items-center gap-4 mb-3">
          <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
            <feature.icon className="w-6 h-6 text-teal-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800">
            {feature.title}
          </h3>
        </div>
        <p className="text-gray-600">{feature.description}</p>
      </div>
    ))}
  </div>
);
