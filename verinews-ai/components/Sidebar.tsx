
import React from 'react';
import { NewsCategory } from '../types';
import CategoryMenu from './CategoryMenu';

interface SidebarProps {
  currentCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentCategory, onCategoryChange }) => {
  return (
    <aside className="w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 h-[calc(100vh-64px)] overflow-hidden sticky top-16 hidden lg:flex flex-col shrink-0 transition-colors duration-300">
      <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
        <span className="text-sm font-black uppercase tracking-widest text-slate-900 dark:text-slate-100">Explore</span>
        <div className="flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-pulse"></span>
          <span className="text-[10px] font-bold text-indigo-600 uppercase tracking-wider">Live Audit</span>
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <CategoryMenu 
          currentCategory={currentCategory} 
          onCategoryChange={onCategoryChange} 
        />
      </div>
    </aside>
  );
};

export default Sidebar;
