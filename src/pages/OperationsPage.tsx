import React, { useState } from 'react';
import { ShieldCheck, CheckSquare, Droplets, Fuel, AlertTriangle, FileText, Check } from 'lucide-react';
import { AdBanner } from '../components/AdBanner';

export const OperationsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'overview' | 'checklists' | 'standards'>('overview');
  
  // Interactive Checklist State
  const [checkedItems, setCheckedItems] = useState<Record<string, boolean>>({});

  const toggleCheck = (id: string) => {
    setCheckedItems(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const checklistItems = [
    { id: 'chk-1', title: 'Bonding Wire Attachment', desc: 'Attach earthing clip to aircraft airframe bonding point BEFORE opening fuel tank caps or connecting hose.' },
    { id: 'chk-2', title: 'Deadman Control Switch Check', desc: 'Perform operational pre-test on pneumatic/electrical deadman switch; verify flow stops within 2.0 seconds upon release.' },
    { id: 'chk-3', title: 'Filter Separator DP Verification', desc: 'Check differential pressure (DP) gauge under maximum flow rate; ensure DP is within standard operating limits (< 15 PSI).' },
    { id: 'chk-4', title: 'Visual Clear & Bright Water Test', desc: 'Draw 1-liter fuel sample from lowest sump point; inspect sample for particulates and insert syringe chemical detector paper.' },
    { id: 'chk-5', title: 'Hydrant Pit Emergency Valve Lockout', desc: 'Confirm emergency fuel shut-off (EFSO) pull handle is accessible and free of obstruction.' },
    { id: 'chk-6', title: 'No-Smoking & Fire Extinguisher Positioning', desc: 'Position two 9kg dry chemical powder (DCP) fire extinguishers upwind within 6 meters of refuelling vehicle.' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">
          <ShieldCheck className="w-4 h-4" /> Aviation Ground Operations
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">ATF Fuel Farm & Apron Refuelling Operations</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Standard operational procedures for Into-Plane fuelling, quality assurance, fuel farm maintenance, and apron ground safety.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-800">
        {[
          { id: 'overview', label: 'Operational Standards', icon: Fuel },
          { id: 'checklists', label: 'Ramp Safety Checklists', icon: CheckSquare },
          { id: 'standards', label: 'Quality Control (QC)', icon: Droplets }
        ].map(tab => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-3 text-xs font-bold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-orange-500 text-orange-400'
                  : 'border-transparent text-slate-400 hover:text-white'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* Content View 1: Overview */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { title: 'ATF Storage & Tankage', count: 'Standard JIG 1', desc: 'Floating suction arms, epoxy-lined steel tanks & automated drain valves.' },
              { title: 'Hydrant Dispenser Carts', count: '120 PSI Line Press.', desc: 'High-flow inline meters, pressure regulators & deadman control.' },
              { title: 'Refueller Fleet Ops', count: '10,000 to 60,000 L', desc: 'Bottom loading, overfill protection sensors & dual hose booms.' },
              { title: 'Ramp Fire Prevention', count: 'NFPA 407 Code', desc: '25-foot safety boundary, bonding clips & EFSO activation stations.' }
            ].map((card, i) => (
              <div key={i} className="bg-slate-900 border border-slate-800 p-5 rounded-xl space-y-2">
                <span className="text-xs text-orange-400 font-mono font-bold">{card.count}</span>
                <h3 className="text-sm font-bold text-white">{card.title}</h3>
                <p className="text-xs text-slate-400 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 md:p-8 space-y-4">
            <h2 className="text-xl font-bold text-white flex items-center gap-2">
              <Fuel className="w-5 h-5 text-orange-400" /> Fuel Farm Daily Operational Workflow
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs text-slate-300 leading-relaxed">
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-orange-400 font-bold font-mono">STEP 01</span>
                <h4 className="font-bold text-white text-sm">Tank Sump Drain & Water Test</h4>
                <p>Drain 5 liters from settled fuel tanks every morning. Perform chemical syringe water test to verify &lt; 15 ppm free water content.</p>
              </div>
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-orange-400 font-bold font-mono">STEP 02</span>
                <h4 className="font-bold text-white text-sm">Differential Pressure Log</h4>
                <p>Check filter coalescer DP gauges at peak transfer flow. Log values daily into WingFuel Operations Log.</p>
              </div>
              <div className="space-y-2 bg-slate-950 p-4 rounded-xl border border-slate-800">
                <span className="text-orange-400 font-bold font-mono">STEP 03</span>
                <h4 className="font-bold text-white text-sm">Hydrant Pit Flushing</h4>
                <p>Perform monthly high-flow flushing of apron hydrant pits to clear any settled particulates before refueling operations.</p>
              </div>
            </div>
          </div>

          <AdBanner type="inline" />
        </div>
      )}

      {/* Content View 2: Interactive Ramp Safety Checklist */}
      {activeTab === 'checklists' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white">Interactive Into-Plane Refuelling Safety Inspection</h2>
                <p className="text-xs text-slate-400">Complete pre-refuelling verification before authorizing hose connection.</p>
              </div>
              <div className="text-right font-mono text-xs">
                <span className="text-orange-400 font-bold">
                  {Object.values(checkedItems).filter(Boolean).length} / {checklistItems.length}
                </span> Completed
              </div>
            </div>

            <div className="space-y-3">
              {checklistItems.map(item => {
                const isChecked = !!checkedItems[item.id];
                return (
                  <div
                    key={item.id}
                    onClick={() => toggleCheck(item.id)}
                    className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 ${
                      isChecked
                        ? 'bg-emerald-950/40 border-emerald-800/80 text-emerald-100'
                        : 'bg-slate-950 border-slate-800 text-slate-200 hover:border-slate-700'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded flex items-center justify-center shrink-0 mt-0.5 border ${
                      isChecked ? 'bg-emerald-500 border-emerald-400 text-white' : 'border-slate-700 bg-slate-900'
                    }`}>
                      {isChecked && <Check className="w-3.5 h-3.5" />}
                    </div>
                    <div>
                      <h4 className={`text-sm font-bold ${isChecked ? 'text-emerald-300 line-through' : 'text-white'}`}>
                        {item.title}
                      </h4>
                      <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content View 3: Quality Control */}
      {activeTab === 'standards' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Droplets className="w-5 h-5 text-orange-400" /> ATF Quality Control Testing Standard Specifications
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left text-slate-300">
                <thead className="bg-slate-950 text-slate-400 font-mono uppercase text-[11px] border-b border-slate-800">
                  <tr>
                    <th className="p-3">Test Parameter</th>
                    <th className="p-3">Specification Limit</th>
                    <th className="p-3">Test Method Standard</th>
                    <th className="p-3">Operational Frequency</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono">
                  <tr>
                    <td className="p-3 font-semibold text-white">Appearance</td>
                    <td className="p-3">Clear, Bright, Visually Free of Solid & Water</td>
                    <td className="p-3 text-slate-400">ASTM D4176 / IP 216</td>
                    <td className="p-3 text-orange-400">Every Sampling Batch</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Density @ 15°C</td>
                    <td className="p-3">775.0 – 840.0 kg/m³</td>
                    <td className="p-3 text-slate-400">ASTM D1298 / IP 160</td>
                    <td className="p-3 text-orange-400">Daily Recipient & Batch</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Free Water Content</td>
                    <td className="p-3">Max 15 ppm</td>
                    <td className="p-3 text-slate-400">ASTM D3240 / Syringe Detector</td>
                    <td className="p-3 text-orange-400">Before Every Aircraft Refuelling</td>
                  </tr>
                  <tr>
                    <td className="p-3 font-semibold text-white">Flash Point</td>
                    <td className="p-3">Min 38.0 °C (100.4 °F)</td>
                    <td className="p-3 text-slate-400">ASTM D56 / IP 170</td>
                    <td className="p-3 text-orange-400">Refinery / Depot Batch Certificate</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
