import React, { useState } from 'react';
import { 
  Calculator, Thermometer, Gauge, Scale, BookMarked, AlertCircle, CheckCircle2, Search, ArrowRight 
} from 'lucide-react';
import { 
  calculateATFDensityCorrection, convertTemperature, convertVolume, 
  convertFuelMassVolume, convertPressure, AVIATION_DICTIONARY 
} from '../lib/aviationMath';
import { AdBanner } from '../components/AdBanner';

export const ToolsPage: React.FC = () => {
  const [activeTool, setActiveTool] = useState<'density' | 'temp' | 'vol' | 'massVol' | 'pressure' | 'dictionary'>('density');

  // Tool 1: Density Calculator State
  const [obsDensity, setObsDensity] = useState<number>(795.5);
  const [obsTemp, setObsTemp] = useState<number>(28.5);
  const [refTemp, setRefTemp] = useState<number>(15);

  const densityResult = calculateATFDensityCorrection({
    observedDensity: obsDensity,
    observedTemp: obsTemp,
    refTemp
  });

  // Tool 2: Temp Converter State
  const [tempVal, setTempVal] = useState<number>(30);
  const [fromTempUnit, setFromTempUnit] = useState<'C' | 'F' | 'K'>('C');
  const [toTempUnit, setToTempUnit] = useState<'C' | 'F' | 'K'>('F');

  // Tool 3: Vol Converter State
  const [volVal, setVolVal] = useState<number>(1000);
  const [fromVolUnit, setFromVolUnit] = useState<'L' | 'USG' | 'ImpG' | 'M3'>('L');
  const [toVolUnit, setToVolUnit] = useState<'L' | 'USG' | 'ImpG' | 'M3'>('USG');

  // Tool 4: Mass & Vol State
  const [massVolInput, setMassVolInput] = useState<number>(5000); // 5000 L
  const [calcMode, setCalcMode] = useState<'volToMass' | 'massToVol'>('volToMass');
  const [atfDensityInput, setAtfDensityInput] = useState<number>(800.0);

  const massVolRes = convertFuelMassVolume(massVolInput, calcMode, atfDensityInput);

  // Tool 5: Pressure State
  const [pressVal, setPressVal] = useState<number>(90);
  const [fromPress, setFromPress] = useState<'PSI' | 'Bar' | 'kPa'>('PSI');
  const [toPress, setToPress] = useState<'PSI' | 'Bar' | 'kPa'>('Bar');

  // Tool 6: Dictionary State
  const [dictSearch, setDictSearch] = useState('');

  const filteredDict = AVIATION_DICTIONARY.filter(item => 
    item.term.toLowerCase().includes(dictSearch.toLowerCase()) ||
    item.fullForm.toLowerCase().includes(dictSearch.toLowerCase()) ||
    item.definition.toLowerCase().includes(dictSearch.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="border-b border-slate-800 pb-6">
        <div className="flex items-center gap-2 text-xs font-bold text-cyan-400 uppercase tracking-widest mb-1">
          <Calculator className="w-4 h-4" /> Aviation Tools & Calculators
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">ASTM D1250 Validated Aviation Calculators</h1>
        <p className="text-sm text-slate-400 mt-1 max-w-2xl">
          Precision fuel density correction, temperature conversion, volumetric mass math, and aviation abbreviation dictionary.
        </p>
      </div>

      {/* Tool Selector Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-800">
        {[
          { id: 'density', label: '1. ATF Density Correction', icon: Calculator },
          { id: 'temp', label: '2. Temperature Converter', icon: Thermometer },
          { id: 'vol', label: '3. Volume Converter', icon: Gauge },
          { id: 'massVol', label: '4. Fuel Mass & Vol', icon: Scale },
          { id: 'pressure', label: '5. Pressure Converter', icon: Gauge },
          { id: 'dictionary', label: '6. Abbreviation Dictionary', icon: BookMarked },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTool(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-bold rounded-lg whitespace-nowrap transition-colors ${
                activeTool === tab.id
                  ? 'bg-cyan-600 text-white shadow-md'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              <Icon className="w-4 h-4" /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* TOOL 1: ATF Density Correction Calculator */}
      {activeTool === 'density' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Inputs Column */}
          <div className="lg:col-span-5 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6">
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Calculator className="w-5 h-5 text-cyan-400" /> Observed Measurement Inputs
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Observed ATF Density (kg/m³)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={obsDensity}
                  onChange={(e) => setObsDensity(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-cyan-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
                <span className="text-[10px] text-slate-500 mt-1 block">Standard Jet A-1 Range: 775.0 – 840.0 kg/m³</span>
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Observed Fuel Temperature (°C)
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={obsTemp}
                  onChange={(e) => setObsTemp(parseFloat(e.target.value) || 0)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-amber-300 font-mono font-bold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-300 mb-1">
                  Target Reference Temperature (°C)
                </label>
                <select
                  value={refTemp}
                  onChange={(e) => setRefTemp(parseInt(e.target.value))}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200 focus:outline-none focus:border-cyan-500"
                >
                  <option value={15}>15°C (Standard ASTM D1250 Reference)</option>
                  <option value={20}>20°C (Alternative European Reference)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Results Column */}
          <div className="lg:col-span-7 bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Calculation Result</span>
                  <h3 className="text-xl font-bold text-white">Corrected Standard Density</h3>
                </div>
                <span className="text-xs bg-slate-950 text-cyan-400 font-mono px-3 py-1 rounded border border-slate-800">
                  {densityResult.standard}
                </span>
              </div>

              {/* Main Output Box */}
              <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-2">
                <span className="text-xs text-slate-400 uppercase font-semibold">Corrected Density @ {refTemp}°C</span>
                <div className="text-4xl sm:text-5xl font-black text-cyan-400 font-mono">
                  {densityResult.correctedDensity.toFixed(1)} <span className="text-xl text-slate-400">kg/m³</span>
                </div>
                <div className="text-xs font-mono text-slate-400 pt-1">
                  Volume Correction Factor (VCF): <strong className="text-orange-400">{densityResult.volumeCorrectionFactor}</strong>
                </div>
              </div>

              {/* Warnings */}
              {densityResult.warnings.length > 0 && (
                <div className="p-4 bg-amber-950/40 border border-amber-800/50 rounded-xl space-y-1 text-xs text-amber-200">
                  <div className="font-bold flex items-center gap-1.5 text-amber-400">
                    <AlertCircle className="w-4 h-4" /> Out-of-Bounds Warning
                  </div>
                  {densityResult.warnings.map((warn, i) => (
                    <p key={i}>{warn}</p>
                  ))}
                </div>
              )}

              {/* Calculation Explanation */}
              <div className="space-y-2 bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Calculation Breakdown & Audit Steps</h4>
                <ul className="space-y-1.5 text-xs text-slate-300 font-mono">
                  {densityResult.explanation.map((exp, i) => (
                    <li key={i}>{exp}</li>
                  ))}
                </ul>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic">
              Note: This calculation conforms to ASTM D1250 Petroleum Measurement Tables for Kerosene / Jet A-1 fuels.
            </p>
          </div>
        </div>
      )}

      {/* TOOL 2: Temperature Converter */}
      {activeTool === 'temp' && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-white">Temperature Unit Converter</h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Enter Temperature Value</label>
              <input
                type="number"
                value={tempVal}
                onChange={(e) => setTempVal(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">From Unit</label>
                <select
                  value={fromTempUnit}
                  onChange={(e) => setFromTempUnit(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                >
                  <option value="C">Celsius (°C)</option>
                  <option value="F">Fahrenheit (°F)</option>
                  <option value="K">Kelvin (K)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">To Unit</label>
                <select
                  value={toTempUnit}
                  onChange={(e) => setToTempUnit(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                >
                  <option value="C">Celsius (°C)</option>
                  <option value="F">Fahrenheit (°F)</option>
                  <option value="K">Kelvin (K)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block uppercase">Converted Temperature Result</span>
            <div className="text-4xl font-mono font-bold text-orange-400 mt-1">
              {convertTemperature(tempVal, fromTempUnit, toTempUnit)} °{toTempUnit}
            </div>
          </div>
        </div>
      )}

      {/* TOOL 3: Volume Converter */}
      {activeTool === 'vol' && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-white">Fuel Volume Converter</h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Enter Volume Quantity</label>
              <input
                type="number"
                value={volVal}
                onChange={(e) => setVolVal(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">From Unit</label>
                <select
                  value={fromVolUnit}
                  onChange={(e) => setFromVolUnit(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                >
                  <option value="L">Liters (L)</option>
                  <option value="USG">US Gallons (USG)</option>
                  <option value="ImpG">Imperial Gallons (Imp Gal)</option>
                  <option value="M3">Cubic Meters (m³)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">To Unit</label>
                <select
                  value={toVolUnit}
                  onChange={(e) => setToVolUnit(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                >
                  <option value="L">Liters (L)</option>
                  <option value="USG">US Gallons (USG)</option>
                  <option value="ImpG">Imperial Gallons (Imp Gal)</option>
                  <option value="M3">Cubic Meters (m³)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block uppercase">Converted Volume</span>
            <div className="text-4xl font-mono font-bold text-cyan-400 mt-1">
              {convertVolume(volVal, fromVolUnit, toVolUnit)} {toVolUnit}
            </div>
          </div>
        </div>
      )}

      {/* TOOL 4: Mass & Volume Fuel Converter */}
      {activeTool === 'massVol' && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-white">Fuel Mass & Volume Calculator</h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Calculation Direction</label>
              <select
                value={calcMode}
                onChange={(e) => setCalcMode(e.target.value as any)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-slate-200"
              >
                <option value="volToMass">Volume (Liters) &rarr; Fuel Mass (Kg)</option>
                <option value="massToVol">Fuel Mass (Kg) &rarr; Volume (Liters)</option>
              </select>
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">
                {calcMode === 'volToMass' ? 'Enter Volume in Liters' : 'Enter Fuel Mass in Kg'}
              </label>
              <input
                type="number"
                value={massVolInput}
                onChange={(e) => setMassVolInput(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white font-mono"
              />
            </div>
            <div>
              <label className="block text-slate-300 font-semibold mb-1">ATF Density (kg/m³)</label>
              <input
                type="number"
                step="0.5"
                value={atfDensityInput}
                onChange={(e) => setAtfDensityInput(parseFloat(e.target.value) || 800)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white font-mono"
              />
            </div>
          </div>
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-2">
            <span className="text-xs text-slate-400 block uppercase">Calculated Output</span>
            <div className="text-3xl font-mono font-bold text-orange-400">
              {massVolRes.result} {massVolRes.unit}
            </div>
            <p className="text-[11px] font-mono text-slate-500 pt-1">{massVolRes.formula}</p>
          </div>
        </div>
      )}

      {/* TOOL 5: Pressure Converter */}
      {activeTool === 'pressure' && (
        <div className="max-w-xl mx-auto bg-slate-900 border border-slate-800 p-6 rounded-2xl space-y-6">
          <h3 className="text-lg font-bold text-white">Refuelling Hydrant Pressure Converter</h3>
          <div className="space-y-4 text-xs">
            <div>
              <label className="block text-slate-300 font-semibold mb-1">Pressure Value</label>
              <input
                type="number"
                value={pressVal}
                onChange={(e) => setPressVal(parseFloat(e.target.value) || 0)}
                className="w-full bg-slate-950 border border-slate-800 rounded-lg p-3 text-sm text-white font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-slate-300 font-semibold mb-1">From Unit</label>
                <select
                  value={fromPress}
                  onChange={(e) => setFromPress(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                >
                  <option value="PSI">PSI (Pounds per sq inch)</option>
                  <option value="Bar">Bar</option>
                  <option value="kPa">Kilopascals (kPa)</option>
                </select>
              </div>
              <div>
                <label className="block text-slate-300 font-semibold mb-1">To Unit</label>
                <select
                  value={toPress}
                  onChange={(e) => setToPress(e.target.value as any)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2.5 text-sm text-slate-200"
                >
                  <option value="PSI">PSI (Pounds per sq inch)</option>
                  <option value="Bar">Bar</option>
                  <option value="kPa">Kilopascals (kPa)</option>
                </select>
              </div>
            </div>
          </div>
          <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center">
            <span className="text-xs text-slate-400 block uppercase">Converted Pressure</span>
            <div className="text-4xl font-mono font-bold text-amber-400 mt-1">
              {convertPressure(pressVal, fromPress, toPress)} {toPress}
            </div>
          </div>
        </div>
      )}

      {/* TOOL 6: Aviation Abbreviation Dictionary */}
      {activeTool === 'dictionary' && (
        <div className="space-y-6">
          <div className="bg-slate-900 border border-slate-800 p-4 rounded-xl flex items-center gap-3">
            <Search className="w-4 h-4 text-slate-500 shrink-0" />
            <input
              type="text"
              value={dictSearch}
              onChange={(e) => setDictSearch(e.target.value)}
              placeholder="Search aviation acronyms, e.g. ATF, VCF, JIG, NOTAM..."
              className="w-full bg-transparent text-sm text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredDict.map((item, idx) => (
              <div key={idx} className="bg-slate-900 border border-slate-800 rounded-xl p-5 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-lg font-black text-cyan-400 font-mono">{item.term}</span>
                  <span className="text-[10px] bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800">
                    {item.category}
                  </span>
                </div>
                <h4 className="text-xs font-bold text-white">{item.fullForm}</h4>
                <p className="text-xs text-slate-300 leading-relaxed pt-1">{item.definition}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <AdBanner type="inline" />
    </div>
  );
};
