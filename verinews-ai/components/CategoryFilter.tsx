
import React from 'react';
import { NewsCategory } from '../types';

interface CategoryFilterProps {
  currentCategory: NewsCategory | 'All';
  onCategoryChange: (category: NewsCategory | 'All') => void;
}

const categories: (NewsCategory | 'All')[] = [
  'All', 'India', 'World', 'Politics', 'Technology', 'Business', 'Health', 'Science', 'Sports'
];

const CategoryFilter: React.FC<CategoryFilterProps> = ({ currentCategory, onCategoryChange }) => {
  return (
    <div className="flex overflow-x-auto no-scrollbar gap-2 pb-4 pt-6 px-4 sm:px-0">
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onCategoryChange(cat)}
          className={`whitespace-nowrap px-5 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
            currentCategory === cat
              ? 'bg-indigo-600 text-white border-indigo-600 shadow-md shadow-indigo-200'
              : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-400 hover:text-indigo-600'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
