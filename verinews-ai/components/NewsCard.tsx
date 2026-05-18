
import React from 'react';
import { NewsArticle } from '../types';

interface NewsCardProps {
  article: NewsArticle;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Verified': return 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 border-green-200 dark:border-green-800';
      case 'Low Confidence': return 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800';
      case 'Unverified': return 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-200 dark:border-red-800';
      default: return 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 50) return 'text-amber-600 dark:text-amber-400';
    return 'text-red-600 dark:text-red-400';
  };

  const formatDate = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatFullDateTime = (dateStr: string) => {
    try {
      const date = new Date(dateStr);
      const d = date.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
      const t = date.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: true
      });
      return `${d} at ${t}`;
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden hover:shadow-xl hover:shadow-slate-200/50 dark:hover:shadow-indigo-900/10 transition-all duration-300 group flex flex-col h-full">
      <div className="relative h-48 overflow-hidden">
        <img 
          src={article.imageUrl || `https://picsum.photos/seed/${article.id}/800/400`} 
          alt={article.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-white/90 dark:bg-slate-900/90 backdrop-blur text-slate-800 dark:text-slate-100 shadow-sm border border-slate-100 dark:border-slate-800">
            {article.category}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-indigo-600 text-white shadow-sm">
            {article.country}
          </span>
        </div>
      </div>
      
      <div className="p-6 flex flex-col flex-grow">
        <div className="flex justify-between items-start mb-3">
          <div className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${getStatusColor(article.verificationStatus)}`}>
            {article.verificationStatus}
          </div>
          <div className="text-right">
            <span className={`text-xl font-bold ${getScoreColor(article.authenticityScore)}`}>
              {article.authenticityScore}%
            </span>
            <p className="text-[10px] text-slate-400 font-medium uppercase leading-none">Trust Score</p>
          </div>
        </div>

        <h3 className="text-lg font-bold text-slate-900 dark:text-slate-100 leading-snug mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
          {article.title}
        </h3>

        {/* Date Row */}
        <div className="flex flex-col gap-1.5 mb-4">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-600 dark:text-slate-400">
            <svg className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Published: {formatDate(article.publishedAt)}
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Verified on: {formatFullDateTime(article.verifiedAt)}
          </div>
        </div>
        
        <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-3 mb-6 flex-grow leading-relaxed">
          {article.summary}
        </p>

        <div className="space-y-4 mt-auto">
          {/* AI Analysis Result */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-800 border-l-4 border-l-indigo-600 transition-colors">
            <p className="text-[11px] text-slate-600 dark:text-slate-400 font-medium leading-relaxed italic">
              "AI Audit: {article.explanation}"
            </p>
          </div>

          {/* Source Attribution */}
          <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
            <p className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
              Verified Reliable Sources
            </p>
            <div className="flex flex-wrap gap-2">
              {article.sources.map((source, idx) => (
                <a 
                  key={idx}
                  href={source.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-[11px] font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/20 px-3 py-1.5 rounded-lg border border-indigo-100 dark:border-indigo-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 hover:text-white dark:hover:text-white transition-all group/src"
                  title={`View original coverage on ${source.name}`}
                >
                  <span className="truncate max-w-[100px]">{source.name}</span>
                  <svg className="w-3 h-3 opacity-60 group-hover/src:opacity-100" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;
