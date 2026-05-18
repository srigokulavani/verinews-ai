
import React from 'react';
import { NewsCategory } from '../types';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  searchQuery: string;
  onSearchChange: (value: string) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  onClearSearch: () => void;
  currentCategory: NewsCategory;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ 
  theme, 
  toggleTheme, 
  searchQuery, 
  onSearchChange, 
  onSearchSubmit, 
  onClearSearch,
  currentCategory,
  isLoading = false
}) => {

  return (
    <header className="sticky top-0 z-50 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 transition-colors duration-300">
      <div className="max-w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-12 items-center h-16 gap-4">
          
          {/* Logo Section - Span 3 */}
          <div className="col-span-3 flex items-center gap-2 shrink-0">
            <div className="bg-indigo-600 p-1.5 rounded-lg shadow-sm">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04m12.728 12.728L12 21l-4.11-4.11M12 21a9.003 9.003 0 008.354-5.646 9.003 9.003 0 00-8.354-5.646m0 11.292A9.003 9.003 0 013.646 15.354 9.003 9.003 0 0112 9.708" />
              </svg>
            </div>
            <div className="hidden md:block">
              <h1 className="text-lg font-bold tracking-tight text-slate-900 dark:text-slate-100 leading-none">VeriNews <span className="text-indigo-600 font-medium">AI</span></h1>
              <p className="text-[9px] text-slate-400 font-bold uppercase tracking-[0.2em] mt-0.5">Verified Intelligence</p>
            </div>
          </div>

          {/* Centered Search Bar - Span 6 */}
          <div className="col-span-6 flex justify-center">
            <form onSubmit={onSearchSubmit} className="relative w-full max-w-2xl group flex items-center">
              <div className="relative flex-1">
                <input
                  type="text"
                  placeholder={`Search ${currentCategory === 'All' ? 'global news' : 'in ' + currentCategory}...`}
                  value={searchQuery}
                  onChange={(e) => onSearchChange(e.target.value)}
                  disabled={isLoading}
                  className={`w-full pl-11 pr-24 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all text-sm text-slate-900 dark:text-slate-100 shadow-sm group-hover:shadow-md ${isLoading ? 'opacity-70 cursor-wait' : ''}`}
                />
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  {isLoading ? (
                    <svg className="animate-spin h-4 w-4 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : (
                    <svg className="w-4 h-4 text-slate-400 group-focus-within:text-indigo-600 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  )}
                </div>
                {searchQuery && !isLoading && (
                  <button 
                    type="button" 
                    onClick={onClearSearch}
                    className="absolute right-20 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                )}
                
                {/* Embedded Search Button */}
                <button
                  type="submit"
                  disabled={isLoading || !searchQuery.trim()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-4 py-1.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 dark:disabled:bg-slate-700 text-white text-[11px] font-bold uppercase tracking-wider rounded-xl transition-all shadow-sm active:scale-95"
                >
                  Search
                </button>
              </div>
            </form>
          </div>
          
          {/* Actions Section - Span 3 */}
          <div className="col-span-3 flex items-center justify-end gap-3 shrink-0">
             <button 
               onClick={toggleTheme}
               className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all active:scale-90"
               title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
             >
               {theme === 'dark' ? (
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707M17.657 17.657l-.707-.707M6.343 6.343l-.707-.707M12 8a4 4 0 100 8 4 4 0 000-8z" />
                 </svg>
               ) : (
                 <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                 </svg>
               )}
             </button>
             <div className="hidden xl:flex items-center px-3 py-1 rounded-full text-[10px] font-bold bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800 uppercase tracking-widest gap-2">
               <span className="w-1.5 h-1.5 rounded-full bg-green-500"></span>
               AI Secured
             </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
