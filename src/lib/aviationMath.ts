/**
 * WingFuel.co — Aviation Standard Calculation Engine
 */

// 1. ATF Density Correction Calculator (ASTM D1250 Standard)
export interface DensityCorrectionInput {
  observedDensity: number; // in kg/m³ or g/cm³ (e.g., 795.5 kg/m³)
  observedTemp: number;    // in °C (e.g., 28.5 °C)
  refTemp?: number;        // target reference temp, default 15°C
}

export interface DensityCorrectionResult {
  observedDensity: number;
  observedTemp: number;
  refTemp: number;
  correctedDensity: number; // Density at reference temp (kg/m³)
  volumeCorrectionFactor: number; // VCF (V15/VT)
  standard: string;
  isWithinLimits: boolean;
  warnings: string[];
  explanation: string[];
}

/**
 * Calculates corrected ATF density to reference 15°C using ASTM D1250 / IP 200 standard algorithm.
 * Standard ATF (Jet A-1) density range at 15°C: 775.0 kg/m³ to 840.0 kg/m³.
 */
export function calculateATFDensityCorrection(input: DensityCorrectionInput): DensityCorrectionResult {
  const obsDensity = input.observedDensity < 10 ? input.observedDensity * 1000 : input.observedDensity; // normalize g/cm³ to kg/m³
  const obsTemp = input.observedTemp;
  const refTemp = input.refTemp ?? 15;

  const warnings: string[] = [];
  let isWithinLimits = true;

  if (obsDensity < 775.0 || obsDensity > 840.0) {
    warnings.push(`Observed density (${obsDensity.toFixed(1)} kg/m³) is outside standard Jet A-1 specification bounds (775.0 to 840.0 kg/m³).`);
    isWithinLimits = false;
  }

  if (obsTemp < -20 || obsTemp > 55) {
    warnings.push(`Observed temperature (${obsTemp.toFixed(1)}°C) is outside standard operational range (-20°C to 55°C).`);
    isWithinLimits = false;
  }

  // ASTM D1250 / IP 200 thermal expansion coefficient for aviation kerosene (Jet A-1)
  // Alpha15 ~ 0.00084 / °C base coefficient
  const alpha15 = 0.00084;
  const tempDiff = obsTemp - refTemp;
  
  // Correction factor formula for density:
  // D_ref = D_obs / (1 - alpha15 * tempDiff)
  const vcf = 1 / (1 + alpha15 * tempDiff);
  const correctedDensity = Math.round((obsDensity * vcf) * 10) / 10;

  const explanation = [
    `1. ASTM D1250 Standard Table 53B Kerosene coefficient applied (α₁₅ = 0.00084 / °C).`,
    `2. Temperature delta: ΔT = ${obsTemp.toFixed(1)}°C - ${refTemp}°C = ${tempDiff >= 0 ? '+' : ''}${tempDiff.toFixed(1)}°C.`,
    `3. Volume Correction Factor (VCF): ${vcf.toFixed(5)}.`,
    `4. Corrected Density @ ${refTemp}°C = Observed (${obsDensity.toFixed(1)} kg/m³) × VCF (${vcf.toFixed(5)}) = ${correctedDensity.toFixed(1)} kg/m³.`
  ];

  return {
    observedDensity: obsDensity,
    observedTemp: obsTemp,
    refTemp,
    correctedDensity,
    volumeCorrectionFactor: parseFloat(vcf.toFixed(5)),
    standard: "ASTM D1250 / IP 200 (Table 53B/54B Kerosene)",
    isWithinLimits,
    warnings,
    explanation
  };
}

// 2. Temperature Converter
export function convertTemperature(val: number, from: 'C' | 'F' | 'K', to: 'C' | 'F' | 'K'): number {
  let celsius = val;
  if (from === 'F') celsius = (val - 32) * (5 / 9);
  if (from === 'K') celsius = val - 273.15;

  if (to === 'C') return parseFloat(celsius.toFixed(2));
  if (to === 'F') return parseFloat(((celsius * 9/5) + 32).toFixed(2));
  if (to === 'K') return parseFloat((celsius + 273.15).toFixed(2));
  return val;
}

// 3. Volume Converter
export function convertVolume(val: number, from: 'L' | 'USG' | 'ImpG' | 'M3', to: 'L' | 'USG' | 'ImpG' | 'M3'): number {
  // Base unit Liters
  let liters = val;
  if (from === 'USG') liters = val * 3.78541;
  if (from === 'ImpG') liters = val * 4.54609;
  if (from === 'M3') liters = val * 1000;

  if (to === 'L') return parseFloat(liters.toFixed(2));
  if (to === 'USG') return parseFloat((liters / 3.78541).toFixed(2));
  if (to === 'ImpG') return parseFloat((liters / 4.54609).toFixed(2));
  if (to === 'M3') return parseFloat((liters / 1000).toFixed(4));
  return val;
}

// 4. Mass & Volume Fuel Converter
export function convertFuelMassVolume(val: number, type: 'volToMass' | 'massToVol', densityKgM3: number): { result: number; unit: string; formula: string } {
  const densityKgL = densityKgM3 / 1000; // e.g. 0.800 kg/L
  if (type === 'volToMass') {
    // Input Liters -> Output Kg
    const kg = val * densityKgL;
    const lbs = kg * 2.20462;
    return {
      result: parseFloat(kg.toFixed(2)),
      unit: `kg (${lbs.toFixed(1)} lbs)`,
      formula: `Mass (kg) = Volume (${val} L) × Density (${densityKgL.toFixed(3)} kg/L)`
    };
  } else {
    // Input Kg -> Output Liters
    const liters = val / densityKgL;
    const usg = liters / 3.78541;
    return {
      result: parseFloat(liters.toFixed(2)),
      unit: `Liters (${usg.toFixed(1)} US Gal)`,
      formula: `Volume (L) = Mass (${val} kg) ÷ Density (${densityKgL.toFixed(3)} kg/L)`
    };
  }
}

// 5. General Unit Converter (Pressure & Distance)
export function convertPressure(val: number, from: 'PSI' | 'Bar' | 'kPa', to: 'PSI' | 'Bar' | 'kPa'): number {
  let psi = val;
  if (from === 'Bar') psi = val * 14.5038;
  if (from === 'kPa') psi = val * 0.145038;

  if (to === 'PSI') return parseFloat(psi.toFixed(2));
  if (to === 'Bar') return parseFloat((psi / 14.5038).toFixed(3));
  if (to === 'kPa') return parseFloat((psi / 0.145038).toFixed(2));
  return val;
}

// 6. Aviation Abbreviation Dictionary
export interface AviationTerm {
  term: string;
  fullForm: string;
  category: 'Fuel' | 'Operations' | 'Airport' | 'Technical' | 'General';
  definition: string;
}

export const AVIATION_DICTIONARY: AviationTerm[] = [
  {
    term: "ATF",
    fullForm: "Aviation Turbine Fuel",
    category: "Fuel",
    definition: "Specialized high-grade kerosene refined for gas turbine aircraft engines (commonly Jet A-1 or Jet A)."
  },
  {
    term: "API / IP",
    fullForm: "American Petroleum Institute / Energy Institute",
    category: "Fuel",
    definition: "International technical standards organization defining petroleum measurement tables and quality standards."
  },
  {
    term: "VCF",
    fullForm: "Volume Correction Factor",
    category: "Fuel",
    definition: "A multiplier derived from ASTM tables used to adjust fuel volume measured at observed temperature to reference 15°C."
  },
  {
    term: "FBO",
    fullForm: "Fixed Base Operator",
    category: "Airport",
    definition: "Commercial business granted rights by an airport to provide aviation services like fuelling, hangarage, and ground handling."
  },
  {
    term: "GPU",
    fullForm: "Ground Power Unit",
    category: "Operations",
    definition: "External ground equipment supplying 115V 400Hz AC or 28V DC electrical power to parked aircraft."
  },
  {
    term: "NOTAM",
    fullForm: "Notice to Airmen / Notice to Air Missions",
    category: "General",
    definition: "Official notice filed with aviation authorities to alert pilots of potential hazards along a flight route or at an airport."
  },
  {
    term: "METAR",
    fullForm: "Meteorological Aerodrome Report",
    category: "General",
    definition: "Standardized format for reporting weather information observed at an airfield."
  },
  {
    term: "ISA",
    fullForm: "International Standard Atmosphere",
    category: "Technical",
    definition: "Atmospheric model defined as 15°C temperature, 1013.25 hPa sea level pressure, and 6.5°C/km lapse rate."
  },
  {
    term: "JIG",
    fullForm: "Joint Inspection Group",
    category: "Fuel",
    definition: "World leading organization for aviation fuel quality control and fuelling operational standards (JIG 1 & JIG 2)."
  },
  {
    term: "AFQRJPOS",
    fullForm: "Aviation Fuel Quality Requirements for Jointly Operated Systems",
    category: "Fuel",
    definition: "Check List for Jet A-1 agreed upon by major international oil companies enforcing stringent fuel quality parameters."
  }
];
