import React from "react";

interface Category {
  name: string;
  icon: React.ElementType;
  id: string;
}

interface CategoriesSidebarProps {
  categories: Category[];
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
}

export const CategoriesSidebar = ({
  categories,
  selectedCategory,
  setSelectedCategory,
}: CategoriesSidebarProps) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 sticky top-8">
    <h3 className="text-lg font-semibold text-gray-800 mb-4">Categories</h3>
    <div className="space-y-2">
      {categories.map((category) => (
        <button
          key={category.name}
          onClick={() => setSelectedCategory(category.id)}
          className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
            selectedCategory === category.name
              ? "bg-teal-50 text-teal-700 border border-teal-200"
              : "text-gray-600 hover:bg-gray-50"
          }`}
        >
          <div className="flex items-center gap-3">
            <category.icon className="w-4 h-4" />
            <span className="text-sm font-medium">{category.name}</span>
          </div>
        </button>
      ))}
    </div>
  </div>
);
