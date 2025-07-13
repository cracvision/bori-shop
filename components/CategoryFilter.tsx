import React from 'react';

interface CategoryFilterProps {
    categories: string[];
    selectedCategories: string[];
    onCategoryChange: (category: string) => void;
}

const CategoryFilter: React.FC<CategoryFilterProps> = ({ categories, selectedCategories, onCategoryChange }) => {
    return (
        <div className="w-full mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Filtra por Categoría:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-3">
                {categories.map(category => {
                    const isSelected = selectedCategories.includes(category);
                    return (
                        <label
                            key={category}
                            htmlFor={category}
                            className="flex items-center space-x-3 cursor-pointer group transition-all duration-200 p-2 -ml-2 rounded-lg hover:bg-white/10"
                        >
                            <input
                                type="checkbox"
                                id={category}
                                name={category}
                                value={category}
                                checked={isSelected}
                                onChange={() => onCategoryChange(category)}
                                className="h-5 w-5 rounded border-gray-400 bg-transparent text-purple-500 focus:ring-purple-400 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900/50 accent-purple-500 cursor-pointer"
                                aria-labelledby={`${category}-label`}
                            />
                            <span
                                id={`${category}-label`}
                                className={`text-base font-medium select-none transition-colors duration-200 ${
                                    isSelected ? 'text-purple-300' : 'text-gray-300'
                                } group-hover:text-white`}
                            >
                                {category}
                            </span>
                        </label>
                    );
                })}
            </div>
        </div>
    );
};

export default CategoryFilter;
