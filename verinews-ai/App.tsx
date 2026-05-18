
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import Sidebar from './components/Sidebar';
import { NewsArticle, NewsCategory } from './types';
import { fetchAndVerifyNews } from './services/geminiService';

const App: React.FC = () => {
  const [articles, setArticles] = useState<NewsArticle[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [category, setCategory] = useState<NewsCategory>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [localSearch, setLocalSearch] = useState<string>('');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [theme, setTheme] = useState<'light' | 'dark'>((localStorage.getItem('theme') as 'light' | 'dark') || 'light');

  // Theme effect
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  const loadNews = useCallback(async (cat: NewsCategory, query: string = '') => {
    setLoading(true);
    setError(null);
    try {
      const news = await fetchAndVerifyNews(cat, query);
      setArticles(news);
      setLastUpdated(new Date().toLocaleTimeString());
    } catch (err: any) {
      console.error("Failed to load news", err);
      setError(err.message || "We encountered a temporary issue connecting to our verification engine. Please try again in a moment.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadNews(category, searchQuery);
  }, [category, searchQuery, loadNews]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (localSearch.trim()) {
      setSearchQuery(localSearch);
    } else {
      setSearchQuery('');
    }
  };

  const clearSearch = () => {
    setLocalSearch('');
    setSearchQuery('');
  };

  const sortedArticles = useMemo(() => {
    return [...articles].sort((a, b) => {
      const dateA = new Date(a.publishedAt).getTime();
      const dateB = new Date(b.publishedAt).getTime();
      if (isNaN(dateA) || isNaN(dateB)) return 0;
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });
  }, [articles, sortOrder]);

  const toggleSortOrder = () => {
    setSortOrder(prev => prev === 'newest' ? 'oldest' : 'newest');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col transition-colors duration-300">
      <Header 
        theme={theme} 
        toggleTheme={toggleTheme} 
        searchQuery={localSearch}
        onSearchChange={setLocalSearch}
        onSearchSubmit={handleSearchSubmit}
        onClearSearch={clearSearch}
        currentCategory={category}
        isLoading={loading}
      />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          currentCategory={category} 
          onCategoryChange={(cat) => {
            setLocalSearch('');
            setSearchQuery('');
            setCategory(cat);
          }} 
        />

        <main className="flex-1 overflow-y-auto bg-slate-50 dark:bg-slate-950 scroll-smooth custom-scrollbar">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            
            {/* Page Header Section */}
            <div className="mb-8">
               <h2 className="text-2xl font-black text-slate-900 dark:text-slate-100 tracking-tight flex items-center gap-3">
                  {searchQuery ? (
                    <>
                      <span className="text-indigo-600">Verified Results:</span> {searchQuery}
                    </>
                  ) : (
                    category === 'All' ? 'Top Verified Stories' : category
                  )}
               </h2>
               <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mt-1">
                 {loading ? 'Performing real-time audit across global sources...' : `Verified reports from ${category === 'All' ? 'global' : category} reliable sources.`}
               </p>
            </div>

            {/* Status & Control Section */}
            <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex flex-col gap-1">
                <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${loading ? 'bg-indigo-600 animate-ping' : 'bg-green-500'}`}></span>
                  {loading ? (searchQuery ? `Searching for ${searchQuery}...` : 'Auditing latest events...') : 'Fact-Check Engine Online'}
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <button 
                  onClick={toggleSortOrder}
                  disabled={loading || articles.length === 0}
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-[11px] font-bold uppercase tracking-wider bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {sortOrder === 'newest' ? 'Newest First' : 'Oldest First'}
                </button>
                <div className="text-[11px] text-slate-400 font-bold uppercase tracking-wider">
                  Last Sync: {lastUpdated || 'N/A'}
                </div>
              </div>
            </div>

            {/* Content States */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 h-[450px] animate-pulse">
                    <div className="h-48 bg-slate-100 dark:bg-slate-800 rounded-t-2xl"></div>
                    <div className="p-6 space-y-4">
                      <div className="h-4 w-1/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                      <div className="h-8 w-3/4 bg-slate-100 dark:bg-slate-800 rounded"></div>
                      <div className="h-20 bg-slate-100 dark:bg-slate-800 rounded"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-red-100 dark:border-red-900/30 shadow-sm">
                <div className="bg-red-50 dark:bg-red-900/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                   <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                   </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-2">Audit Failed</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-8 px-6">{error}</p>
                <button 
                  onClick={() => loadNews(category, searchQuery)}
                  className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-100"
                >
                  Retry Verification
                </button>
              </div>
            ) : sortedArticles.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
                {sortedArticles.map((article) => (
                  <NewsCard key={article.id} article={article} />
                ))}
              </div>
            ) : (
              <div className="text-center py-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 border-dashed">
                <div className="bg-slate-50 dark:bg-slate-800 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-slate-300 dark:text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l4 4v10a2 2 0 01-2 2z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 4v5h5" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 13h8M8 17h8" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 mb-1">No verified reports</h3>
                <p className="text-slate-500 dark:text-slate-400">Our verification engine couldn't find consensus for that topic. Try a different search term.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;
