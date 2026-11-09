import React, { useState, useEffect } from 'react';
import { Megaphone, ExternalLink, Info, ShieldCheck } from 'lucide-react';
import { getAdMobConfig, AdMobConfig } from '../lib/admobConfig';

interface AdBannerProps {
  type: 'leaderboard' | 'sidebar' | 'inline' | 'mobile-sticky';
  className?: string;
}

export const AdBanner: React.FC<AdBannerProps> = ({ type, className = '' }) => {
  const [config, setConfig] = useState<AdMobConfig>(getAdMobConfig());

  useEffect(() => {
    const handleStorageChange = () => setConfig(getAdMobConfig());
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  if (!config.enabled) return null;

  // 1. Mobile Sticky Anchor Banner (Bottom Viewport, Height <= 50px so sticky aggregate < 15% mobile height)
  if (type === 'mobile-sticky') {
    return (
      <aside 
        aria-label="Sponsored Mobile Aviation Ad"
        className={`fixed bottom-0 left-0 right-0 z-40 bg-slate-950/95 backdrop-blur-md border-t border-slate-800 p-2 text-center md:hidden ${className}`}
      >
        <div className="max-w-sm mx-auto flex items-center justify-between px-3 py-1.5 bg-slate-900/90 rounded-lg border border-slate-800 shadow-lg">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-[10px] font-black text-orange-400 uppercase tracking-widest bg-orange-950 px-1.5 py-0.5 rounded border border-orange-800/60 shrink-0">
              AdMob
            </span>
            <span className="text-xs text-slate-200 font-medium truncate">
              {config.testMode ? 'AeroFuel Hydrant Test Ad' : 'Sponsor Aviation Partner'}
            </span>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] text-slate-500 font-mono">
              {config.testMode ? 'TEST MODE' : 'LIVE'}
            </span>
            <button className="text-[10px] text-slate-400 hover:text-white p-0.5">
              <Info className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    );
  }

  // 2. Leaderboard Banner (Header / Top Section)
  if (type === 'leaderboard') {
    return (
      <div className={`w-full max-w-5xl mx-auto my-6 p-4 bg-slate-900/80 border border-slate-800 rounded-2xl text-center relative overflow-hidden group shadow-lg ${className}`}>
        <div className="flex items-center justify-between text-[11px] text-slate-400 mb-2.5 border-b border-slate-800 pb-1.5">
          <span className="uppercase tracking-wider font-bold text-orange-400 flex items-center gap-1.5">
            <Megaphone className="w-3.5 h-3.5" /> Google AdMob / Aviation Ad Slot
          </span>
          <span className="font-mono text-[10px] text-slate-500">
            Unit ID: {config.adUnits.leaderboard.slice(0, 24)}...
          </span>
        </div>
        
        <div className="h-24 bg-gradient-to-r from-slate-950 via-slate-900 to-slate-950 rounded-xl flex flex-col sm:flex-row items-center justify-between p-4 border border-dashed border-slate-800 gap-3">
          <div className="text-left space-y-1">
            <div className="flex items-center gap-2">
              <span className="text-[10px] bg-orange-950 text-orange-400 font-bold px-2 py-0.5 rounded border border-orange-800/50">
                RECOMMENDED SUPPLIER
              </span>
              <span className="text-xs text-slate-400 font-mono">ISO 9001:2026</span>
            </div>
            <p className="text-sm font-bold text-white">AeroFuel Equipment Ltd — Into-Plane Refuelling Hydrant Carts & Digital Meters</p>
            <p className="text-xs text-slate-400">Certified for ASTM D1250 / JIG 1 quality control testing. Available across India & APAC airports.</p>
          </div>

          <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1">
            View Equipment Specs <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    );
  }

  // 3. Sidebar Medium Rectangle (300x250 Ad Unit)
  if (type === 'sidebar') {
    return (
      <div className={`w-full p-4 bg-slate-900 border border-slate-800 rounded-2xl text-center my-4 ${className}`}>
        <div className="flex items-center justify-between text-[10px] uppercase font-bold text-slate-400 tracking-wider mb-3">
          <span>AdMob Sponsored</span>
          <span className="font-mono text-slate-500">{config.testMode ? 'TEST UNIT' : 'LIVE'}</span>
        </div>
        <div className="h-56 bg-slate-950 rounded-xl border border-slate-800 p-5 flex flex-col justify-between text-left">
          <div className="space-y-2">
            <span className="text-[10px] bg-amber-950 text-amber-300 font-bold px-2 py-0.5 rounded border border-amber-800/50">
              JET A-1 QUALITY CONTROL
            </span>
            <h4 className="text-sm font-bold text-white">Digital Hydrometers & Water Sampling Syringes</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              ASTM D1250 compliant fuel quality testing kits for fuel farm managers & apron supervisors.
            </p>
          </div>
          <button className="w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-orange-400 text-xs font-bold rounded-lg transition-colors border border-slate-700">
            Request Partner Quote
          </button>
        </div>
      </div>
    );
  }

  // 4. Inline Article Native Banner
  return (
    <div className={`w-full my-6 p-4 bg-slate-900/60 border border-slate-800 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4 ${className}`}>
      <div className="flex items-start gap-3">
        <div className="p-2.5 bg-orange-950/80 text-orange-400 rounded-xl border border-orange-800/60 shrink-0">
          <Megaphone className="w-5 h-5" />
        </div>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider">Aviation Hiring Partner</span>
            <span className="text-[10px] bg-slate-950 text-slate-500 px-1.5 py-0.2 rounded font-mono">AdMob Network</span>
          </div>
          <h4 className="text-sm font-bold text-white mt-0.5">Recruiting Aviation Maintenance & Fuel Engineers?</h4>
          <p className="text-xs text-slate-400">Reach over 50,000 aviation professionals monthly on WingFuel.co.</p>
        </div>
      </div>
      <button className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold rounded-lg transition-colors whitespace-nowrap shrink-0">
        Post Partner Job Ad
      </button>
    </div>
  );
};
