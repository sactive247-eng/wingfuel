import React, { useState } from 'react';
import { BookOpen, Search, Clock, User, ArrowLeft, Bookmark } from 'lucide-react';
import { Article } from '../lib/seedData';
import { AdBanner } from '../components/AdBanner';
import { useBookmarks } from '../lib/bookmarks';
import { ReadingProgressBar } from '../components/ReadingProgressBar';

interface KnowledgePageProps {
  articles: Article[];
}

export const KnowledgePage: React.FC<KnowledgePageProps> = ({ articles }) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeArticle, setActiveArticle] = useState<Article | null>(null);
  const { isBookmarked, toggleBookmark } = useBookmarks();

  const categories = [
    'All',
    'Favorites',
    'Aviation Fuel',
    'Airport Operations',
    'Technical Knowledge',
    'Safety & Compliance'
  ];

  const filteredArticles = articles.filter((art) => {
    const matchesCat =
      selectedCategory === 'All'
        ? true
        : selectedCategory === 'Favorites'
        ? isBookmarked(art.id)
        : art.category === selectedCategory;
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      art.summary.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCat && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      {!activeArticle ? (
        <>
          <div className="border-b border-slate-800 pb-6">
            <div className="flex items-center gap-2 text-xs font-bold text-orange-400 uppercase tracking-widest mb-1">
              <BookOpen className="w-4 h-4" /> Aviation Knowledge Base
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-white">Technical Aviation Library</h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Authoritative guides on ATF physics, airport hydrant infrastructure, quality control sampling, and safety compliance.
            </p>
          </div>

          {/* Filter & Search */}
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 bg-slate-900 p-4 rounded-xl border border-slate-800">
            <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-colors ${
                    selectedCategory === cat
                      ? 'bg-orange-500 text-white shadow-sm font-bold'
                      : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                  }`}
                >
                  {cat === 'Favorites' ? '★ Favorites' : cat}
                </button>
              ))}
            </div>

            <div className="relative w-full md:w-64 shrink-0">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles & topics..."
                className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-9 pr-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-orange-500"
              />
            </div>
          </div>

          {/* Sidebar / Inline Ad */}
          <AdBanner type="inline" />

          {/* Article Grid */}
          {filteredArticles.length === 0 ? (
            <div className="text-center py-16 bg-slate-900/50 rounded-2xl border border-slate-800">
              <p className="text-slate-400 text-sm">
                {selectedCategory === 'Favorites'
                  ? 'No bookmarked articles saved yet. Click the bookmark icon on any guide card to save it.'
                  : 'No aviation articles match your search criteria.'}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {filteredArticles.map((art) => {
                const saved = isBookmarked(art.id);
                return (
                  <div
                    key={art.id}
                    onClick={() => setActiveArticle(art)}
                    className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-orange-500/50 transition-all cursor-pointer flex flex-col justify-between group p-6 relative"
                  >
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 mb-3 pr-8">
                        <span className="text-orange-400 font-bold bg-orange-950/80 px-2.5 py-0.5 rounded border border-orange-800/60">
                          {art.category}
                        </span>
                        <span className="flex items-center gap-1 font-mono text-[11px]"><Clock className="w-3 h-3" /> {art.readTime}</span>
                      </div>

                      {/* Bookmark Toggle Button */}
                      <button
                        onClick={(e) => toggleBookmark(art.id, e)}
                        title={saved ? 'Remove from Favorites' : 'Save to Favorites'}
                        className={`absolute top-5 right-5 p-1.5 rounded-lg transition-transform active:scale-95 ${
                          saved
                            ? 'bg-orange-500 text-white shadow-md'
                            : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
                        }`}
                      >
                        <Bookmark className={`w-3.5 h-3.5 ${saved ? 'fill-current' : ''}`} />
                      </button>

                      <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors leading-snug mb-3">
                        {art.title}
                      </h3>

                      <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed mb-4">
                        {art.summary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
                      <span className="flex items-center gap-1"><User className="w-3.5 h-3.5 text-slate-500" /> {art.author}</span>
                      <span className="text-orange-400 font-bold group-hover:underline">Read Article &rarr;</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* Detailed Article Reader View (Compliant with Editorial §9 reference: drop cap, reading column max-w-2xl) */
        <div className="space-y-6 max-w-4xl mx-auto">
          {/* Dedicated ReadingProgressBar component tracking main element */}
          <ReadingProgressBar targetSelector="main" />

          <button
            onClick={() => setActiveArticle(null)}
            className="flex items-center gap-2 text-xs font-bold text-orange-400 hover:text-orange-300 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Knowledge Library
          </button>

          <article className="bg-slate-900/90 border border-slate-800 rounded-2xl p-6 md:p-10 space-y-6">
            <div className="space-y-3 border-b border-slate-800 pb-6">
              <div className="flex items-center gap-2 text-xs text-slate-400">
                <span className="text-orange-400 font-bold uppercase tracking-wider">{activeArticle.category}</span>
                <span>&middot;</span>
                <span>{activeArticle.readTime}</span>
                <span>&middot;</span>
                <span>Published {activeArticle.publishedAt}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight">
                {activeArticle.title}
              </h1>

              <div className="flex items-center gap-2 text-xs text-slate-400 font-medium pt-2">
                <User className="w-4 h-4 text-orange-400" />
                <span>Written by <strong>{activeArticle.author}</strong></span>
              </div>
            </div>

            {activeArticle.coverImage && (
              <img src={activeArticle.coverImage} alt={activeArticle.title} className="w-full h-72 object-cover rounded-xl border border-slate-800" />
            )}

            {/* Editorial Reading Prose Column */}
            <div className="prose prose-invert max-w-2xl mx-auto text-slate-200 text-sm leading-relaxed space-y-4 whitespace-pre-line font-sans">
              {activeArticle.content}
            </div>

            <AdBanner type="inline" />
          </article>
        </div>
      )}

    </div>
  );
};
