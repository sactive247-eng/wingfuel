import React from 'react';
import { 
  Newspaper, BookOpen, Wrench, Briefcase, ShoppingBag, Calculator, 
  ArrowRight, Shield, Fuel, ChevronRight, Sparkles 
} from 'lucide-react';
import { Article, NewsItem, DigitalProduct } from '../lib/seedData';
import { AdBanner } from '../components/AdBanner';

interface HomePageProps {
  onNavigate: (view: string, id?: string) => void;
  articles: Article[];
  news: NewsItem[];
  products: DigitalProduct[];
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, articles, news, products }) => {
  return (
    <div className="space-y-12 pb-16">
      
      {/* 1. Large Aviation Hero Section */}
      <section className="relative min-h-[520px] flex items-center justify-center overflow-hidden bg-slate-950 border-b border-slate-900">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1600&q=80"
            alt="Commercial Aircraft Refuelling Tarmac Sunset"
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/70 to-slate-950/40" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16 space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950/80 border border-orange-500/40 text-orange-400 text-xs font-bold uppercase tracking-widest shadow-lg backdrop-blur-md">
            <Fuel className="w-3.5 h-3.5" /> Professional Aviation Portal
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Fuel Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-amber-400 to-orange-500">Aviation Knowledge</span>
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-300 font-normal leading-relaxed">
            Aviation news, operational insights, ATF density calculators, digital dashboards, and professional resources for the global aviation community.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <button
              onClick={() => onNavigate('knowledge')}
              className="w-full sm:w-auto px-6 py-3.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <BookOpen className="w-4 h-4" /> Explore Articles
            </button>
            <button
              onClick={() => onNavigate('products')}
              className="w-full sm:w-auto px-6 py-3.5 bg-slate-900/90 hover:bg-slate-800 text-slate-200 border border-slate-700 font-semibold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4 text-orange-400" /> Explore Digital Resources
            </button>
          </div>
        </div>
      </section>

      {/* Leaderboard Ad Slot */}
      <div className="px-4">
        <AdBanner type="leaderboard" />
      </div>

      {/* 2. Quick Navigation Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[
            { id: 'news', title: 'Aviation News', icon: Newspaper, desc: 'Latest updates & summaries', color: 'from-blue-600 to-indigo-600' },
            { id: 'knowledge', title: 'Knowledge Base', icon: BookOpen, desc: 'ATF & technical guides', color: 'from-orange-500 to-amber-600' },
            { id: 'operations', title: 'Ground Operations', icon: Shield, desc: 'Refuelling & checklists', color: 'from-emerald-600 to-teal-600' },
            { id: 'jobs', title: 'Aviation Careers', icon: Briefcase, desc: 'Job postings & hiring', color: 'from-purple-600 to-violet-600' },
            { id: 'products', title: 'Digital Products', icon: ShoppingBag, desc: 'Excel templates & dashboards', color: 'from-rose-600 to-pink-600' },
            { id: 'tools', title: 'Aviation Tools', icon: Calculator, desc: 'ATF density math & converters', color: 'from-cyan-600 to-blue-600' },
          ].map((card) => {
            const Icon = card.icon;
            return (
              <button
                key={card.id}
                onClick={() => onNavigate(card.id)}
                className="bg-slate-900/80 hover:bg-slate-800/90 border border-slate-800 hover:border-orange-500/50 rounded-xl p-4 text-left transition-all group flex flex-col justify-between"
              >
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center text-white mb-3 shadow-md group-hover:scale-110 transition-transform`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors flex items-center justify-between">
                    {card.title}
                    <ChevronRight className="w-4 h-4 text-slate-600 group-hover:text-orange-400" />
                  </h3>
                  <p className="text-[11px] text-slate-400 mt-1 line-clamp-1">{card.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* 3. Latest Aviation News Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Industry Updates</span>
            <h2 className="text-2xl font-black text-white">Latest Aviation News</h2>
          </div>
          <button
            onClick={() => onNavigate('news')}
            className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
          >
            View All News <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {news.slice(0, 3).map((item) => (
            <div
              key={item.id}
              onClick={() => onNavigate('news')}
              className="bg-slate-900 border border-slate-800 rounded-xl overflow-hidden hover:border-slate-700 transition-all cursor-pointer group flex flex-col justify-between"
            >
              <div>
                <div className="h-44 overflow-hidden relative">
                  <img
                    src={item.coverImage || "/src/assets/images/hero_aviation_jet_1794011579584.jpg"}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 left-3 bg-slate-950/90 border border-slate-700 text-orange-400 text-[10px] font-bold px-2 py-0.5 rounded">
                    {item.category}
                  </span>
                </div>
                <div className="p-4 space-y-2">
                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span>{item.sourceName}</span>
                    <span>{item.publishedAt}</span>
                  </div>
                  <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {item.summary}
                  </p>
                </div>
              </div>
              <div className="px-4 pb-4 pt-2 border-t border-slate-800/60 flex items-center justify-between text-xs text-orange-400 font-semibold">
                <span>Read Brief</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Featured Aviation Knowledge */}
      <section className="bg-slate-900/60 border-y border-slate-800/80 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Technical Library</span>
              <h2 className="text-2xl font-black text-white">Featured Aviation Knowledge</h2>
            </div>
            <button
              onClick={() => onNavigate('knowledge')}
              className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
            >
              Explore Knowledge Hub <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {articles.slice(0, 3).map((art) => (
              <div
                key={art.id}
                onClick={() => onNavigate('knowledge')}
                className="bg-slate-950 border border-slate-800 rounded-xl p-5 hover:border-orange-500/50 transition-all cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between text-xs text-slate-400 mb-3">
                    <span className="text-orange-400 font-semibold">{art.category}</span>
                    <span>{art.readTime}</span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-2 line-clamp-2 hover:text-orange-400 transition-colors">
                    {art.title}
                  </h3>
                  <p className="text-xs text-slate-300 line-clamp-3 leading-relaxed">
                    {art.summary}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-900 text-xs text-slate-400 flex items-center justify-between">
                  <span>By {art.author}</span>
                  <span className="text-orange-400 font-semibold flex items-center gap-1">Read Article &rarr;</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Inline Ad Banner */}
      <div className="max-w-7xl mx-auto px-4">
        <AdBanner type="inline" />
      </div>

      {/* 5. Useful Aviation Tools Preview (ATF Density Math) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 md:p-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-cyan-950 text-cyan-400 border border-cyan-800/50 text-xs font-bold uppercase tracking-wider">
              <Calculator className="w-3.5 h-3.5" /> ASTM D1250 Validated Tool
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-white">ATF Density Correction Calculator</h2>
            <p className="text-sm text-slate-300 leading-relaxed">
              Instantly adjust observed Jet A-1 density to standard reference temperature of 15°C (59°F) using official ASTM Table 53B petroleum measurement algorithms.
            </p>
            <div className="flex flex-wrap gap-4 text-xs text-slate-400 font-mono">
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Observed Range: 775.0 – 840.0 kg/m³</span>
              <span className="bg-slate-950 px-2.5 py-1 rounded border border-slate-800">Standard Ref: 15°C</span>
            </div>
          </div>
          <div className="w-full lg:w-auto shrink-0">
            <button
              onClick={() => onNavigate('tools')}
              className="w-full sm:w-auto px-8 py-4 bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2"
            >
              Launch Calculator Engine <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* 6. Featured Digital Products Store */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-orange-400 uppercase tracking-widest">Digital Products</span>
            <h2 className="text-2xl font-black text-white">Operations Dashboards & Templates</h2>
          </div>
          <button
            onClick={() => onNavigate('products')}
            className="text-xs font-bold text-orange-400 hover:text-orange-300 flex items-center gap-1"
          >
            Visit Digital Store <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((prod) => (
            <div
              key={prod.id}
              className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between hover:border-slate-700 transition-all"
            >
              <div>
                <div className="flex items-center justify-between text-xs mb-3">
                  <span className="text-orange-400 font-semibold">{prod.category}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{prod.fileSizeBytes}</span>
                </div>
                <h3 className="text-base font-bold text-white mb-2">{prod.title}</h3>
                <p className="text-xs text-slate-300 line-clamp-3 mb-4 leading-relaxed">{prod.description}</p>
                <ul className="space-y-1.5 text-xs text-slate-300 mb-6">
                  {prod.features.slice(0, 3).map((feat, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <span className="text-orange-400 font-bold">&check;</span> {feat}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400">Price: </span>
                  <span className="text-lg font-black text-white font-mono">₹{prod.priceINR}</span>
                </div>
                <button
                  onClick={() => onNavigate('products')}
                  className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Buy Now & Download
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};
