import React from 'react';
import { Fuel, ShieldCheck, Mail, MapPin, Globe, Lock } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';

export const AboutPage: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6 text-center space-y-3">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-950 text-orange-400 border border-orange-800 text-xs font-bold uppercase tracking-widest">
          <Fuel className="w-3.5 h-3.5" /> About WingFuel.co
        </div>
        <h1 className="text-3xl sm:text-5xl font-black text-white">Fuel Your Aviation Knowledge</h1>
        <p className="text-sm text-slate-300 max-w-2xl mx-auto leading-relaxed">
          WingFuel.co is a dedicated technical aviation platform providing breaking aviation news, operational fuel manuals, ASTM D1250 density calculators, career listings, and digital products for the global aviation community.
        </p>
      </div>

      {/* Mission & Standards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-orange-400" /> Operational Excellence
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            Our mission is to standardize access to critical aviation fuel quality data, ground handling checklists, and ASTM density math so airport operators, refuelling crews, and pilots can operate with absolute safety.
          </p>
        </div>

        <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-3">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Globe className="w-5 h-5 text-cyan-400" /> Domain & Official Branding
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            WingFuel.co is registered and hosted for global access. We collaborate with refuelling equipment suppliers, airport authorities, and civil aviation regulators.
          </p>
        </div>
      </div>

      {/* Ad Banner */}
      <AdBanner type="inline" />

      {/* Legal Disclaimers & Terms */}
      <div className="bg-slate-900/80 border border-slate-800 p-6 md:p-8 rounded-2xl space-y-6 text-xs text-slate-300 leading-relaxed">
        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Technical Calculation & ASTM Standards Disclaimer</h3>
          <p>
            The ATF density correction algorithms provided on WingFuel.co are calculated in accordance with general ASTM D1250 / IP 200 petroleum measurement principles for informational and operational training guidance. For official into-plane billing and custody transfer receipts, always cross-reference certified physical hydrometers and official refinery certificates.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Privacy Policy & Data Security</h3>
          <p>
            WingFuel.co respects user privacy. Subscriber email addresses collected for our newsletter and digital product transactions are stored securely in Google Cloud Firestore and are never sold or shared with third parties.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">Terms of Service</h3>
          <p>
            All digital products, Excel dashboards, and checklist templates downloaded from WingFuel.co are licensed for professional personal or corporate use. Unauthorized redistribution or re-hosting of WingFuel.co materials is strictly prohibited.
          </p>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 text-xs">
        <div className="space-y-1">
          <h4 className="text-base font-bold text-white">Contact Editorial & Engineering Team</h4>
          <p className="text-slate-400">Have news tips, RSS feed submissions, or digital product inquiries?</p>
        </div>
        <div className="flex items-center gap-4 shrink-0 font-mono text-slate-200">
          <span className="flex items-center gap-1.5"><Mail className="w-4 h-4 text-orange-400" /> editorial@wingfuel.co</span>
          <span className="flex items-center gap-1.5"><Globe className="w-4 h-4 text-cyan-400" /> wingfuel.co</span>
        </div>
      </div>

    </div>
  );
};
