import React, { useState, useEffect } from 'react';
import { Search, X, Newspaper, BookOpen, ShoppingBag, Calculator, ChevronRight, ArrowRight } from 'lucide-react';
import { Article, NewsItem, DigitalProduct } from '../lib/seedData';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  articles: Article[];
  news: NewsItem[];
  products: DigitalProduct[];
  onNavigate: (view: string, id?: string) => void;
}

export const GlobalSearchModal: React.FC<GlobalSearchModalProps> = ({
  isOpen,
  onClose,
  articles,
  news,
  products,
  onNavigate
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const trimmed = query.trim().toLowerCase();

  const matchingNews = trimmed
    ? news.filter(n => n.title.toLowerCase().includes(trimmed) || n.summary.toLowerCase().includes(trimmed) || n.category.toLowerCase().includes(trimmed))
    : news.slice(0, 3);

  const matchingArticles = trimmed
    ? articles.filter(a => a.title.toLowerCase().includes(trimmed) || a.summary.toLowerCase().includes(trimmed) || a.category.toLowerCase().includes(trimmed))
    : articles.slice(0, 3);

  const matchingProducts = trimmed
    ? products.filter(p => p.title.toLowerCase().includes(trimmed) || p.description.toLowerCase().includes(trimmed) || p.category.toLowerCase().includes(trimmed))
    : products.slice(0, 3);

  const totalResults = (trimmed ? (matchingNews.length + matchingArticles.length + matchingProducts.length) : 0);

  const handleSelect = (view: string) => {
    onNavigate(view);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-slate-800 flex items-center gap-3 bg-slate-950">
          <Search className="w-5 h-5 text-orange-500 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Global Search across Aviation News, Knowledge Base, Tools & Products..."
            autoFocus
            className="w-full bg-transparent text-sm text-slate-100 placeholder-slate-500 focus:outline-none font-medium"
          />
          {query && (
            <button onClick={() => setQuery('')} className="p-1 text-slate-400 hover:text-white">
              &times;
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 bg-slate-800 hover:bg-slate-700 text-slate-400 text-xs font-mono rounded"
          >
            ESC
          </button>
        </div>

        {/* Results Container */}
        <div className="overflow-y-auto p-4 space-y-6 flex-1 text-xs">
          
          {trimmed && totalResults === 0 && (
            <div className="text-center py-12 text-slate-400">
              No results found for "<span className="text-slate-200 font-semibold">{query}</span>". Try searching for "ATF", "Density", "Hydrant", "Jewar", or "Dashboard".
            </div>
          )}

          {/* Section 1: Aviation News */}
          {matchingNews.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <Newspaper className="w-3.5 h-3.5" /> Aviation News ({matchingNews.length})
                </span>
                <button onClick={() => handleSelect('news')} className="text-orange-400 hover:underline">View All &rarr;</button>
              </div>
              <div className="space-y-1.5">
                {matchingNews.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => handleSelect('news')}
                    className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-orange-400 font-semibold">{item.category}</span>
                        <span className="text-slate-500 font-mono text-[10px]">&middot; {item.publishedAt}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">{item.title}</h4>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-orange-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 2: Aviation Knowledge Base */}
          {matchingArticles.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <span className="flex items-center gap-1.5 text-orange-400">
                  <BookOpen className="w-3.5 h-3.5" /> Knowledge Base Articles ({matchingArticles.length})
                </span>
                <button onClick={() => handleSelect('knowledge')} className="text-orange-400 hover:underline">View All &rarr;</button>
              </div>
              <div className="space-y-1.5">
                {matchingArticles.map((art) => (
                  <div
                    key={art.id}
                    onClick={() => handleSelect('knowledge')}
                    className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-orange-400 font-semibold">{art.category}</span>
                        <span className="text-slate-500 font-mono text-[10px]">&middot; {art.readTime}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">{art.title}</h4>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-orange-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Digital Products */}
          {matchingProducts.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                <span className="flex items-center gap-1.5 text-rose-400">
                  <ShoppingBag className="w-3.5 h-3.5" /> Digital Store Products ({matchingProducts.length})
                </span>
                <button onClick={() => handleSelect('products')} className="text-orange-400 hover:underline">View All &rarr;</button>
              </div>
              <div className="space-y-1.5">
                {matchingProducts.map((prod) => (
                  <div
                    key={prod.id}
                    onClick={() => handleSelect('products')}
                    className="p-3 bg-slate-950/80 hover:bg-slate-800 border border-slate-800/80 hover:border-slate-700 rounded-xl transition-all cursor-pointer flex items-center justify-between group"
                  >
                    <div className="space-y-0.5 max-w-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] text-rose-400 font-semibold">{prod.category}</span>
                        <span className="text-slate-200 font-mono font-bold text-[11px]">&middot; ₹{prod.priceINR}</span>
                      </div>
                      <h4 className="text-xs font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-1">{prod.title}</h4>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-orange-400 shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Quick Tools Shortcuts */}
          <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-cyan-400" />
              <span className="text-cyan-200 font-medium">Looking for ASTM D1250 Density Calculator?</span>
            </div>
            <button
              onClick={() => handleSelect('tools')}
              className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
            >
              Open Calculators <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

        <div className="p-3 bg-slate-950 border-t border-slate-800 text-[11px] text-slate-500 flex items-center justify-between px-4">
          <span>Search WingFuel.co Catalog</span>
          <span>Press <kbd className="bg-slate-800 text-slate-300 px-1.5 py-0.5 rounded font-mono">ESC</kbd> to exit</span>
        </div>
      </div>
    </div>
  );
};
