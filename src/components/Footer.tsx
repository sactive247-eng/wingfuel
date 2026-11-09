import React, { useState } from 'react';
import { Fuel, Send, CheckCircle } from 'lucide-react';
import { db } from '../lib/firebase';
import { collection, addDoc } from 'firebase/firestore';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    try {
      await addDoc(collection(db, 'subscribers'), {
        email: email.trim(),
        subscribedAt: new Date().toISOString(),
        source: 'footer'
      });
      setSubscribed(true);
      setEmail('');
    } catch (err) {
      console.warn('Subscriber save error:', err);
      setSubscribed(true);
    }
  };

  return (
    <footer className="bg-slate-100 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 text-slate-600 dark:text-slate-400 text-xs pt-12 pb-24 md:pb-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="h-10 flex items-center justify-center">
                <img
                  src="/assets/aistudio/WingFuel_Orbit_Logo_e3f91314.png"
                  alt="WingFuel.co Official Logo"
                  className="h-8 w-auto object-contain mix-blend-multiply dark:bg-white/90 dark:px-2 dark:py-1 dark:rounded-lg dark:mix-blend-normal shadow-sm"
                />
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 text-xs leading-relaxed">
              Fuel Your Aviation Knowledge. Premier technical resource for aviation news, airport ground operations, ATF density calculations, and professional digital products.
            </p>
            <p className="text-[11px] text-slate-500 dark:text-slate-500">
              Domain: <strong className="text-slate-800 dark:text-slate-300">wingfuel.co</strong>
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">Navigation</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('news')} className="hover:text-orange-500 transition-colors">Aviation News</button></li>
              <li><button onClick={() => onNavigate('knowledge')} className="hover:text-orange-500 transition-colors">Aviation Knowledge Library</button></li>
              <li><button onClick={() => onNavigate('operations')} className="hover:text-orange-500 transition-colors">Airport Ground Operations</button></li>
              <li><button onClick={() => onNavigate('tools')} className="hover:text-orange-500 transition-colors">ATF Density Calculator</button></li>
              <li><button onClick={() => onNavigate('products')} className="hover:text-orange-500 transition-colors">Digital Products Store</button></li>
              <li><button onClick={() => onNavigate('jobs')} className="hover:text-orange-500 transition-colors">Aviation Careers</button></li>
            </ul>
          </div>

          {/* Categories */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 mb-3">Technical Topics</h4>
            <ul className="space-y-2 text-xs">
              <li><button onClick={() => onNavigate('operations')} className="hover:text-orange-500 transition-colors">ATF Density & Temp Correction</button></li>
              <li><button onClick={() => onNavigate('operations')} className="hover:text-orange-500 transition-colors">Hydrant Systems & Refuelling</button></li>
              <li><button onClick={() => onNavigate('operations')} className="hover:text-orange-500 transition-colors">Filter Separators & Water Defense</button></li>
              <li><button onClick={() => onNavigate('operations')} className="hover:text-orange-500 transition-colors">Quality Control & Sampling</button></li>
              <li><button onClick={() => onNavigate('insights')} className="hover:text-orange-500 transition-colors">Sustainable Aviation Fuel (SAF)</button></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Aviation Intelligence Newsletter</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">Get weekly ATF updates, regulatory news summaries, and digital template releases.</p>
            
            {subscribed ? (
              <div className="flex items-center gap-2 p-2 bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-lg text-xs">
                <CheckCircle className="w-4 h-4 text-emerald-600 dark:text-emerald-400" /> Subscribed to WingFuel Intelligence!
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter work email..."
                  required
                  className="bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-900 dark:text-slate-200 focus:outline-none focus:border-orange-500 w-full"
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 text-white p-2 rounded-lg transition-colors shrink-0"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>

        <div className="pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-slate-500 dark:text-slate-500">
          <div>
            &copy; {new Date().getFullYear()} WingFuel.co. All Rights Reserved.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('about')} className="hover:text-slate-800 dark:hover:text-slate-300">Privacy Policy</button>
            <span>&middot;</span>
            <button onClick={() => onNavigate('about')} className="hover:text-slate-800 dark:hover:text-slate-300">Terms of Service</button>
            <span>&middot;</span>
            <button onClick={() => onNavigate('about')} className="hover:text-slate-800 dark:hover:text-slate-300">Legal Disclaimer</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
