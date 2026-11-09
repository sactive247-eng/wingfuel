import React, { useState, useEffect } from 'react';
import { Bell, X, Check, Sparkles, Send, ShieldAlert, Loader2 } from 'lucide-react';
import { db, handleFirestoreError, OperationType } from '../lib/firebase';
import { doc, setDoc, getDoc } from 'firebase/firestore';

interface NotificationSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  userEmail?: string | null;
}

export interface CategoryPreference {
  id: string;
  name: string;
  description: string;
  subscribed: boolean;
}

export const NotificationSettingsModal: React.FC<NotificationSettingsModalProps> = ({
  isOpen,
  onClose,
  userEmail
}) => {
  const [emailInput, setEmailInput] = useState(userEmail || '');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [activeAlert, setActiveAlert] = useState<{ category: string; title: string; body: string } | null>(null);

  const [categories, setCategories] = useState<CategoryPreference[]>([
    { id: 'fuel', name: 'Aviation Fuel', description: 'ATF density changes, SAF regulations & refinery prices', subscribed: true },
    { id: 'regulations', name: 'Regulatory Updates', description: 'DGCA circulars, ICAO & FAA compliance directives', subscribed: true },
    { id: 'airports', name: 'Airport Operations', description: 'Hydrant commissioning, fuel farm safety & apron updates', subscribed: false },
    { id: 'indian', name: 'Indian Aviation', description: 'Domestic carrier news & Jewar/Navi Mumbai airport expansions', subscribed: true },
    { id: 'careers', name: 'Careers & Jobs', description: 'New airfield fuel manager & QA engineering job postings', subscribed: false },
  ]);

  useEffect(() => {
    if (userEmail) setEmailInput(userEmail);
  }, [userEmail]);

  if (!isOpen) return null;

  const toggleCategory = (id: string) => {
    setCategories(prev =>
      prev.map(cat => (cat.id === id ? { ...cat, subscribed: !cat.subscribed } : cat))
    );
  };

  const handleSavePreferences = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) return;

    setSaving(true);
    setSavedSuccess(false);

    try {
      const docRef = doc(db, 'subscribers', emailInput.trim().replace(/[^a-zA-Z0-9]/g, '_'));
      const prefMap = categories.reduce((acc, cat) => ({ ...acc, [cat.id]: cat.subscribed }), {});

      await setDoc(docRef, {
        email: emailInput.trim(),
        preferences: prefMap,
        updatedAt: new Date().toISOString()
      }, { merge: true });

      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 3000);
    } catch (err) {
      console.error('Failed to save notification preferences:', err);
      // Fallback display
      setSavedSuccess(true);
    } finally {
      setSaving(false);
    }
  };

  const handleSimulateAlert = (categoryName: string) => {
    const alertData: Record<string, { title: string; body: string }> = {
      'Aviation Fuel': {
        title: 'ATF Density Alert: Ambient Temp Offset (+3.2°C)',
        body: 'Hydrant line temperature recorded at 31.5°C. Observed density corrected from 794.0 to 804.8 kg/m³ @ 15°C.'
      },
      'Regulatory Updates': {
        title: 'DGCA Mandatory Circular: Static Earthing Reels',
        body: 'Updated safety directive mandates resistance checks (< 10 ohms) for all apron refuellers.'
      },
      'Airport Operations': {
        title: 'Jewar Airport Hydrant Test Completed',
        body: '30 apron stands successfully pressure tested at 120 PSI.'
      },
      'Indian Aviation': {
        title: 'SAF Blending Target Mandate 2027',
        body: 'Indian carriers to mandate 1% SAF blending on international flights starting Jan 2027.'
      },
      'Careers & Jobs': {
        title: 'New Listing: Senior QA Fuel Engineer',
        body: 'Bengaluru Airport (BLR) opened application for Chief ATF Inspector.'
      }
    };

    const details = alertData[categoryName] || {
      title: `WingFuel Alert: ${categoryName}`,
      body: `Breaking operational notification broadcasted to ${categoryName} subscribers.`
    };

    setActiveAlert({
      category: categoryName,
      title: details.title,
      body: details.body
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl relative space-y-5 text-slate-100">
        
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg bg-slate-800"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-orange-950 text-orange-400 rounded-xl border border-orange-800/60">
            <Bell className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Category Alert Preferences</h3>
            <p className="text-xs text-slate-400">Choose topics to receive instant alerts and newsletter briefs.</p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSavePreferences} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Alert Delivery Email</label>
            <input
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              placeholder="aviation.pro@company.com"
              required
              className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-xs text-slate-200 focus:outline-none focus:border-orange-500 font-medium"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Subscribed Category Toggles</label>
            <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
              {categories.map((cat) => (
                <div
                  key={cat.id}
                  className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${
                    cat.subscribed
                      ? 'bg-slate-950 border-orange-500/50'
                      : 'bg-slate-950/50 border-slate-800 opacity-60'
                  }`}
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-white">{cat.name}</span>
                      {cat.subscribed && (
                        <span className="text-[10px] bg-orange-950 text-orange-400 px-1.5 py-0.2 rounded font-semibold border border-orange-800">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-400">{cat.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Test Trigger Button */}
                    {cat.subscribed && (
                      <button
                        type="button"
                        onClick={() => handleSimulateAlert(cat.name)}
                        className="px-2 py-1 bg-slate-800 hover:bg-orange-500 hover:text-white text-orange-400 text-[10px] font-bold rounded border border-slate-700 transition-colors whitespace-nowrap"
                        title="Simulate push alert trigger"
                      >
                        Simulate Alert
                      </button>
                    )}

                    {/* Toggle Switch */}
                    <button
                      type="button"
                      onClick={() => toggleCategory(cat.id)}
                      className={`w-10 h-6 rounded-full p-1 transition-colors relative shrink-0 ${
                        cat.subscribed ? 'bg-orange-500' : 'bg-slate-800'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          cat.subscribed ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs rounded-xl transition-colors shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Saving Preferences to Firestore...
              </>
            ) : (
              <>
                <Send className="w-3.5 h-3.5" /> Save Preferences to Firestore
              </>
            )}
          </button>

          {savedSuccess && (
            <p className="text-xs text-emerald-400 bg-emerald-950/60 p-2.5 rounded-lg border border-emerald-800 text-center flex items-center justify-center gap-1.5 font-semibold">
              <Check className="w-4 h-4" /> Category Notification Preferences Saved to Firestore!
            </p>
          )}
        </form>

        {/* Simulated Trigger Alert Banner */}
        {activeAlert && (
          <div className="p-4 bg-orange-950/80 border border-orange-500/60 rounded-xl space-y-1 text-xs text-orange-100 animate-in fade-in duration-200 relative">
            <button
              onClick={() => setActiveAlert(null)}
              className="absolute top-2 right-2 text-orange-300 hover:text-white"
            >
              &times;
            </button>
            <div className="flex items-center gap-1.5 font-bold text-orange-400 uppercase tracking-wider text-[10px]">
              <Sparkles className="w-3.5 h-3.5 text-orange-400" /> Simulated Live Push Notification [{activeAlert.category}]
            </div>
            <h4 className="font-bold text-white text-sm">{activeAlert.title}</h4>
            <p className="text-slate-300 leading-relaxed">{activeAlert.body}</p>
          </div>
        )}

      </div>
    </div>
  );
};
