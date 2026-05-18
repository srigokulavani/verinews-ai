import React, { useState, useMemo } from 'react';
import { NewsCategory } from '../types';
import { MAIN_CATEGORIES, INDIAN_STATES } from '../constants';

interface CategoryMenuProps {
  currentCategory: NewsCategory;
  onCategoryChange: (category: NewsCategory) => void;
  onClose?: () => void;
}

const CategoryMenu: React.FC<CategoryMenuProps> = ({ currentCategory, onCategoryChange, onClose }) => {
  const [filterQuery, setFilterQuery] = useState('');
  const [isGeneralOpen, setIsGeneralOpen] = useState(true);
  const [isStatesOpen, setIsStatesOpen] = useState(false);

  const filteredMain = useMemo(() => 
    MAIN_CATEGORIES.filter(cat => cat.toLowerCase().includes(filterQuery.toLowerCase())),
    [filterQuery]
  );

  const filteredStates = useMemo(() => 
    INDIAN_STATES.filter(state => state.toLowerCase().includes(filterQuery.toLowerCase())),
    [filterQuery]
  );

  // Auto-expand sections if searching and matches found
  useMemo(() => {
    if (filterQuery) {
      if (filteredMain.length > 0 && filteredMain.length < MAIN_CATEGORIES.length) {
        setIsGeneralOpen(true);
      }
      if (filteredStates.length > 0 && filteredStates.length < INDIAN_STATES.length) {
        setIsStatesOpen(true);
      }
    }
  }, [filterQuery, filteredMain.length, filteredStates.length]);

  const handleCategorySelect = (cat: NewsCategory) => {
    onCategoryChange(cat);
    if (onClose) onClose();
  };

  return (
    <div className="flex flex-col h-full max-h-[80vh] w-full">
      {/* Search Bar */}
      <div className="p-4 border-b border-slate-100 dark:border-slate-800">
        <div className="relative group">
          <input
            type="text"
            placeholder="Search categories or states..."
            value={filterQuery}
            onChange={(e) => setFilterQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all"
          />
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* Categories List */}
      <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
        <div className="space-y-1">
          
          {/* General Topics Sub-menu */}
          {(filteredMain.length > 0 || filterQuery === '') && (
            <div>
              <button
                onClick={() => setIsGeneralOpen(!isGeneralOpen)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                  MAIN_CATEGORIES.includes(currentCategory)
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  <span>General Topics</span>
                </div>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isGeneralOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${isGeneralOpen ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                <div className="pl-4 space-y-0.5 border-l-2 border-slate-100 dark:border-slate-800 ml-6 mt-1">
                  {filteredMain.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => handleCategorySelect(cat)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                        currentCategory === cat
                          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
                          : 'text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* States Sub-menu */}
          {(filteredStates.length > 0 || filterQuery === '') && (
            <div className="pt-2">
              <button
                onClick={() => setIsStatesOpen(!isStatesOpen)}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-between ${
                  INDIAN_STATES.includes(currentCategory)
                    ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50/50 dark:bg-indigo-900/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  <span>Indian States</span>
                </div>
                <svg 
                  className={`w-4 h-4 transition-transform duration-200 ${isStatesOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              <div className={`overflow-hidden transition-all duration-300 ${isStatesOpen ? 'max-h-[1000px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
                <div className="pl-4 space-y-0.5 border-l-2 border-slate-100 dark:border-slate-800 ml-6 mt-1">
                  {filteredStates.map((state) => (
                    <button
                      key={state}
                      onClick={() => handleCategorySelect(state)}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-[13px] font-medium transition-all ${
                        currentCategory === state
                          ? 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30'
                          : 'text-slate-500 dark:text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
                      }`}
                    >
                      {state}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {filteredMain.length === 0 && filteredStates.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">No matches found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CategoryMenu;
