import React from 'react';
import { TrendingUp, Globe, Shield, Zap, ChevronRight } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';

export const InsightsPage: React.FC = () => {
  const insights = [
    {
      id: 'ins-1',
      title: 'Global SAF Supply Chains & Indian Refineries Roadmap 2026–2030',
      category: 'Sustainable Aviation Fuel',
      date: 'November 2026',
      readTime: '7 min read',
      excerpt: 'As global aviation targets net-zero carbon by 2050, Indian state refiners (IOCL, BPCL, HPCL) are accelerating Hydroprocessed Esters and Fatty Acids (HEFA) plant construction.',
      author: 'Aviation Fuel Research Group'
    },
    {
      id: 'ins-2',
      title: 'Digitalization of Apron Refuelling: Automated Flow Meters & Cloud Density Logging',
      category: 'Technology & Innovation',
      date: 'October 2026',
      readTime: '5 min read',
      excerpt: 'How IoT pressure sensors, electronic deadman monitoring, and cloud-linked mass flow meters are eliminating paper delivery tickets across tier-1 airports.',
      author: 'GSE Engineering Advisory'
    },
    {
      id: 'ins-3',
      title: 'Greenfield Airport Expansion in India: Fuel Hydrant Infrastructure Benchmarks',
      category: 'Airport Infrastructure',
      date: 'October 2026',
      readTime: '6 min read',
      excerpt: 'Comparative analysis of underground fuel hydrant loops across Jewar, Navi Mumbai, and Bengaluru Terminal 2 airport developments.',
      author: 'Infrastructure Intelligence Brief'
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-widest mb-1">
          <TrendingUp className="w-4 h-4" /> Industry Insights & Analysis
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Aviation Market Trends & Infrastructure Intelligence</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Deep-dive analysis into Sustainable Aviation Fuel (SAF), airport expansion, refinery economics, and Into-Plane technology.
        </p>
      </div>

      <AdBanner type="leaderboard" />

      {/* Insights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {insights.map((item) => (
          <div
            key={item.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl p-6 flex flex-col justify-between hover:border-amber-500/50 transition-all group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="text-amber-400 font-bold bg-amber-950/80 px-2.5 py-0.5 rounded border border-amber-800/60">
                  {item.category}
                </span>
                <span className="font-mono text-[11px]">{item.readTime}</span>
              </div>

              <h3 className="text-lg font-bold text-white group-hover:text-amber-400 transition-colors leading-snug">
                {item.title}
              </h3>

              <p className="text-xs text-slate-300 leading-relaxed line-clamp-4">
                {item.excerpt}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>{item.author}</span>
              <span className="text-amber-400 font-bold flex items-center gap-1 group-hover:underline">
                Read Analysis <ChevronRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        ))}
      </div>

      <AdBanner type="inline" />
    </div>
  );
};
