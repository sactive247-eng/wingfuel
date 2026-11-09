import React, { useState } from 'react';
import { Newspaper, Search, Sparkles, ExternalLink, Filter, Calendar, Bookmark } from 'lucide-react';
import { NewsItem } from '../lib/seedData';
import { AdBanner } from '../components/AdBanner';
import { useBookmarks } from '../lib/bookmarks';

interface NewsPageProps {
  news: NewsItem[];
}

export const NewsPage: React.FC<NewsPageProps> = ({ news }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNewsModal, setActiveNewsModal] = useState<NewsItem | null>(null);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const categories = [
    'All',
    'Favorites',
    'Indian Aviation',
    'Global Aviation',
    'Airports',
    'Airlines',
    'Aviation Fuel',
    'Aircraft',
    'Regulatory Updates',
    'Infrastructure'
  ];

  const filteredNews = news.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Favorites'
        ? isBookmarked(item.id)
        : item.category === selectedCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">
          <Newspaper className="w-4 h-4" /> Aviation News Portal
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Breaking Aviation Intelligence</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Curated and semi-automated news summaries covering Indian & global commercial aviation, fuel markets, airports, and regulatory updates.
        </p>
      </div>

      {/* Filter & Search Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
        
        {/* Category Tabs (Interactive Segmented Control Buttons) */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-sm font-bold'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'Favorites' ? '★ Favorites' : cat}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full md:w-64 shrink-0">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search news & topics..."
            className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
          />
        </div>
      </div>

      {/* Leaderboard Ad */}
      <AdBanner type="leaderboard" />

      {/* News Grid */}
      {filteredNews.length === 0 ? (
        <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
          <p className="text-slate-400 text-sm">
            {selectedCategory === 'Favorites'
              ? 'No bookmarked favorites yet. Click the bookmark icon on any news card to save it.'
              : 'No aviation news articles match your filter criteria.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredNews.map((item) => {
            const saved = isBookmarked(item.id);
            return (
              <div
                key={item.id}
                onClick={() => setActiveNewsModal(item)}
                className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all cursor-pointer flex flex-col justify-between group relative"
              >
                <div>
                  <div className="h-48 relative overflow-hidden">
                    <img
                      src={item.coverImage || "/src/assets/images/hero_aviation_jet_1794011579584.jpg"}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 flex items-center gap-2">
                      <span className="bg-slate-950/90 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded border border-slate-800">
                        {item.category}
                      </span>
                      {item.aiSummarized && (
                        <span className="bg-purple-950/90 text-purple-300 text-[10px] font-bold px-2 py-0.5 rounded border border-purple-800 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> Gemini Summary
                        </span>
                      )}
                    </div>

                    {/* Bookmark Toggle Button */}
                    <button
                      onClick={(e) => toggleBookmark(item.id, e)}
                      title={saved ? 'Remove from Favorites' : 'Save to Favorites'}
                      className={`absolute top-3 right-3 p-2 rounded-xl backdrop-blur-md transition-transform active:scale-95 ${
                        saved
                          ? 'bg-orange-500 text-white shadow-lg'
                          : 'bg-slate-950/80 text-slate-400 hover:text-white border border-slate-800'
                      }`}
                    >
                      <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                    </button>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-slate-400">
                      <span className="font-semibold text-slate-300">{item.sourceName}</span>
                      <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {item.publishedAt}</span>
                    </div>

                    <h3 className="text-base font-bold text-white group-hover:text-orange-400 transition-colors leading-snug">
                      {item.title}
                    </h3>

                    <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>
                </div>

                <div className="px-5 py-3 bg-slate-950/50 border-t border-slate-800 text-xs text-orange-400 font-semibold flex items-center justify-between">
                  <span>Read Full Brief & Attribution</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {activeNewsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-slate-900 border border-slate-800 w-full max-w-2xl rounded-2xl p-6 shadow-2xl relative space-y-4 max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveNewsModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
            >
              &times;
            </button>

            <div className="flex items-center gap-2">
              <span className="text-xs bg-orange-950 text-orange-400 font-bold px-2.5 py-1 rounded border border-orange-800">
                {activeNewsModal.category}
              </span>
              <span className="text-xs text-slate-400 font-mono">Source: {activeNewsModal.sourceName}</span>
            </div>

            <h2 className="text-xl font-bold text-white leading-tight">{activeNewsModal.title}</h2>

            {activeNewsModal.coverImage && (
              <img src={activeNewsModal.coverImage} alt={activeNewsModal.title} className="w-full h-56 object-cover rounded-xl" />
            )}

            {activeNewsModal.aiSummarized && (
              <div className="p-3 bg-purple-950/40 border border-purple-800/50 rounded-xl text-xs text-purple-200 flex items-start gap-2">
                <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-purple-300 font-bold">Gemini AI Executive Summary</strong>
                  <p className="mt-1 leading-relaxed">{activeNewsModal.summary}</p>
                </div>
              </div>
            )}

            <div className="space-y-3 text-xs text-slate-300 leading-relaxed border-t border-slate-800 pt-3">
              <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">Full Story Details</h4>
              <p>{activeNewsModal.content}</p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs">
              <span className="text-slate-400">Published: {activeNewsModal.publishedAt}</span>
              <a
                href={activeNewsModal.sourceUrl}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors"
              >
                Visit Original Source <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
