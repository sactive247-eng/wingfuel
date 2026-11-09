export interface Article {
  id: string;
  title: string;
  slug: string;
  category: 'Aviation Fuel' | 'Airport Operations' | 'Technical Knowledge' | 'Safety & Compliance' | 'Ground Operations';
  subCategory?: string;
  summary: string;
  content: string;
  author: string;
  publishedAt: string;
  readTime: string;
  status: 'published' | 'draft';
  coverImage?: string;
}

export interface NewsItem {
  id: string;
  title: string;
  sourceUrl: string;
  sourceName: string;
  category: 'Indian Aviation' | 'Global Aviation' | 'Airports' | 'Airlines' | 'Aviation Fuel' | 'Aircraft' | 'Regulatory Updates' | 'Infrastructure';
  summary: string;
  content: string;
  publishedAt: string;
  status: 'approved' | 'pending' | 'rejected';
  aiSummarized: boolean;
  coverImage?: string;
}

export interface DigitalProduct {
  id: string;
  title: string;
  category: 'Excel Templates' | 'Aviation Checklists' | 'Operations Dashboards' | 'Interview Preparation Kits' | 'Aviation Guides' | 'Productivity Tools';
  description: string;
  priceINR: number;
  features: string[];
  previewImage: string;
  downloadFileName: string;
  fileSizeBytes: string;
  status: 'active' | 'archived';
}

export interface JobListing {
  id: string;
  title: string;
  company: string;
  location: string;
  type: 'Full-Time' | 'Contract' | 'Shift-Based';
  category: 'Ground Operations' | 'Fuel Logistics' | 'Quality Control' | 'Airport Engineering' | 'Safety Compliance';
  qualifications: string;
  applyUrl: string;
  expiryDate: string;
  status: 'published' | 'expired';
}

export const INITIAL_ARTICLES: Article[] = [
  {
    id: "art-01",
    title: "ATF Density & Temperature Correction: Standard ASTM D1250 Protocol",
    slug: "atf-density-temperature-correction-astm-d1250",
    category: "Aviation Fuel",
    subCategory: "Fuel Quality & Physics",
    summary: "Complete operational guide to calculating Aviation Turbine Fuel density corrections to standard 15°C reference using ASTM D1250 Petroleum Measurement Tables.",
    content: `
# ATF Density & Temperature Correction Protocol

Aviation Turbine Fuel (Jet A-1) volume changes significantly with ambient temperature changes. For precise inventory accounting, refuelling mass calculations, and safety compliance, observed density must always be corrected to standard reference temperature of 15°C (59°F).

## Why Temperature Correction Matters

When ATF is transferred from underground hydrant systems at 20°C into refueller tanks exposed to 38°C tarmac sun, the fuel expands. While the volume increases, the total mass remains constant. Aircraft fuel calculations (block fuel, trip fuel, reserve fuel) rely strictly on mass (kg or lbs).

### ASTM D1250 Standard Table 53B / 54B
The international standard standardizes density adjustment based on the thermal expansion coefficient of kerosene (α₁₅ ≈ 0.00084 / °C).

$$\text{Density}_{15} = \frac{\text{Density}_{obs}}{1 + \alpha_{15} \cdot (T_{obs} - 15)}$$

## Step-by-Step Field Measurement Procedure
1. Draw a fresh representative 1-liter fuel sample into a clean glass hydrometer cylinder.
2. Insert a calibrated ASTM hydrometer (range 0.775 to 0.850 g/ml) and standard thermometer.
3. Allow temperature to stabilize for 60 seconds before reading eye-level hydrometer meniscus.
4. Record observed density and observed temperature immediately.
5. Apply WingFuel.co Density Correction Tool or ASTM Table 53B to record standard density @ 15°C on the Delivery Receipt (BDN).
    `,
    author: "Capt. R. Sharma, Chief Fuel Quality Inspector",
    publishedAt: "2026-10-15",
    readTime: "6 min read",
    status: "published",
    coverImage: "/src/assets/images/atf_refuelling_ops_1794011579438.jpg"
  },
  {
    id: "art-02",
    title: "Airport Hydrant Fuelling System Operations & Safety Standards",
    slug: "airport-hydrant-fuelling-system-operations",
    category: "Airport Operations",
    subCategory: "Hydrant & Refuelling",
    summary: "Detailed overview of high-pressure underground airport hydrant networks, dispenser cart safety controls, deadman valves, and surge suppressors.",
    content: `
# Airport Hydrant Fuelling System Operations

Modern international airports utilize underground high-pressure fuel hydrant systems capable of delivering thousands of liters per minute directly from fuel farms to apron stands.

## Core System Components
- **Fuel Farm Pumps**: Variable frequency drive centrifugal pumps maintaining constant line pressure (approx. 90-120 PSI).
- **Apron Hydrant Pit Valves**: High-grade stainless steel self-closing valves installed flush with tarmac pavement.
- **Dispenser Carts**: Mobile towable or self-propelled vehicles equipped with filtration, metering, pressure control, and deadman valves.

## Critical Safety Procedures
1. **Bonding & Grounding**: Bonding cable must be attached to aircraft airframe BEFORE any hose connection is made.
2. **Deadman Control**: Operator must hold the deadman control switch; releasing it stops fuel flow within 2 seconds.
3. **Emergency Fuel Shut-Off (EFSO)**: Located at every apron stand and control tower.
    `,
    author: "Vikram Mehta, Airport Operations Lead",
    publishedAt: "2026-10-28",
    readTime: "8 min read",
    status: "published",
    coverImage: "/src/assets/images/airport_operations_apron_1794011578150.jpg"
  },
  {
    id: "art-03",
    title: "Aviation Fuel Quality Control: Filter Separators & Monitor Elements",
    slug: "aviation-fuel-quality-control-filter-separators",
    category: "Technical Knowledge",
    subCategory: "Filtration Systems",
    summary: "Comprehensive guide to EI 1581 filter separators, particulate filtration, water coalescing, and differential pressure (DP) monitoring.",
    content: `
# Aviation Fuel Quality Control & Filtration

Water and particulate contamination pose catastrophic risks to turbine engines. Fuel filtration systems operate continuously across every transfer stage from refinery to wing tip.

## EI 1581 Filter Coalescers
Filter coalescers feature two-stage elements:
1. **1st Stage Coalescer**: Cartridges remove fine solids down to 0.5 microns and coalesce micro-droplets of water into large drops.
2. **2nd Stage Separator**: Hydrophobic Teflon-coated mesh repels water drops, allowing only dry clean ATF to pass through.

## Differential Pressure (DP) Tracking
DP must be checked and recorded daily at maximum flow rate. A sudden drop indicates filter element rupture, while a steep rise indicates heavy particulate clogging.
    `,
    author: "Anita Roy, QA Systems Manager",
    publishedAt: "2026-11-02",
    readTime: "5 min read",
    status: "published",
    coverImage: "/src/assets/images/aviation_knowledge_hub_1794011580342.jpg"
  }
];

export const INITIAL_NEWS: NewsItem[] = [
  {
    id: "news-01",
    title: "Noida International Airport (Jewar) Tests Advanced Underground Fuel Hydrant Network",
    sourceUrl: "https://wingfuel.co/news/jewar-airport-fuel-hydrant-test",
    sourceName: "Indian Aviation Digest",
    category: "Indian Aviation",
    summary: "Noida International Airport in Jewar successfully commissioned its state-of-the-art underground ATF hydrant network capable of servicing 30 aircraft stands simultaneously with automated pressure control.",
    content: "Engineers at Noida International Airport Jewar conducted dry-run pressure tests on the newly installed 12-kilometer aviation fuel pipeline. The facility integrates automated leak detection and high-capacity filter separators.",
    publishedAt: "2026-11-05",
    status: "approved",
    aiSummarized: true,
    coverImage: "/src/assets/images/hero_aviation_jet_1794011579584.jpg"
  },
  {
    id: "news-02",
    title: "Global Airlines Accelerate SAF Off-Take Contracts for 2027 Sustainability Targets",
    sourceUrl: "https://wingfuel.co/news/global-saf-offtake-contracts-2027",
    sourceName: "Aviation Week & Space Tech",
    category: "Aviation Fuel",
    summary: "Major international carriers have committed over $4.2 billion in Sustainable Aviation Fuel (SAF) purchase agreements to meet upcoming CORSIA mandatory blending ratios.",
    content: "The global SAF market is experiencing unprecedented demand expansion as refiners scale up HEFA and Synthetic Kerosene production lines across North America, Europe, and Asia-Pacific.",
    publishedAt: "2026-11-04",
    status: "approved",
    aiSummarized: true,
    coverImage: "/src/assets/images/atf_refuelling_ops_1794011579438.jpg"
  },
  {
    id: "news-03",
    title: "DGCA Issues Updated Guidelines for Apron Refuelling Safety and Static Earthing Inspection",
    sourceUrl: "https://wingfuel.co/news/dgca-apron-refuelling-safety-circular",
    sourceName: "Civil Aviation Regulatory Bulletin",
    category: "Regulatory Updates",
    summary: "Directorate General of Civil Aviation (DGCA) has mandated bi-weekly electrical resistance testing for ground earthing reels and bonding clips across all licensed Indian airports.",
    content: "Under the new circular, refuelling service providers must maintain digital calibration logs for bonding resistance, ensuring total resistance between aircraft airframe and hydrant dispenser does not exceed 10 ohms.",
    publishedAt: "2026-11-03",
    status: "approved",
    aiSummarized: true,
    coverImage: "/src/assets/images/airport_operations_apron_1794011578150.jpg"
  }
];

export const INITIAL_PRODUCTS: DigitalProduct[] = [
  {
    id: "prod-01",
    title: "Airport ATF Fuel Farm Operations & Inventory Master Excel Dashboard",
    category: "Operations Dashboards",
    description: "Automated Excel template for tracking daily ATF receipt tanks, temperature-density corrections (ASTM Table 53B), tank dip conversions, pump hour logs, and gain/loss variance analysis.",
    priceINR: 1499,
    features: [
      "ASTM D1250 Density Correction Formula Built-In",
      "Daily Inventory Gain/Loss Percentage Tracking",
      "Tank Dip to Liter Conversion Tables",
      "Monthly QC Audit Summary Sheet",
      "Fully Customizable Excel (.xlsx) Format"
    ],
    previewImage: "/src/assets/images/aviation_knowledge_hub_1794011580342.jpg",
    downloadFileName: "WingFuel_ATF_FuelFarm_Master_Dashboard.xlsx",
    fileSizeBytes: "2.4 MB",
    status: "active"
  },
  {
    id: "prod-02",
    title: "Comprehensive Aircraft Refuelling & Apron Ground Safety Checklist Bundle",
    category: "Aviation Checklists",
    description: "Ready-to-print and digital PDF/Word templates for Into-Plane refuelling crew chief checks, dispenser pre-use inspection, deadman system tests, and static bonding verifications.",
    priceINR: 799,
    features: [
      "22 Standard Operational Checklists",
      "JIG 1 & JIG 2 Compliance Standards",
      "Printable PDF & Editable DOCX Formats",
      "Emergency Shut-Off Procedure Cards"
    ],
    previewImage: "/src/assets/images/atf_refuelling_ops_1794011579438.jpg",
    downloadFileName: "WingFuel_Apron_Refuelling_Checklist_Bundle.zip",
    fileSizeBytes: "4.1 MB",
    status: "active"
  },
  {
    id: "prod-03",
    title: "Aviation Ground Operations & Refuelling Manager Interview Prep Kit",
    category: "Interview Preparation Kits",
    description: "Curated guide with 150+ real technical interview questions and answers covering fuel physics, QA sampling, hydrant mechanics, apron safety regulations, and scenario troubleshooting.",
    priceINR: 1199,
    features: [
      "150+ Verified Technical Q&As",
      "Scenario-Based Emergency Case Studies",
      "DGCA & IATA Regulatory Overview",
      "Resume & Portfolio Sample Templates"
    ],
    previewImage: "/src/assets/images/hero_aviation_jet_1794011579584.jpg",
    downloadFileName: "WingFuel_Aviation_Ops_Interview_Kit.pdf",
    fileSizeBytes: "5.8 MB",
    status: "active"
  }
];

export const INITIAL_JOBS: JobListing[] = [
  {
    id: "job-01",
    title: "Aviation Fuel Quality Control Engineer",
    company: "Indian Oil SkyTanking Aviation Ltd",
    location: "Bengaluru International Airport (BLR)",
    type: "Full-Time",
    category: "Quality Control",
    qualifications: "B.Tech/Diploma in Chemical or Mechanical Engineering with 3+ years experience in ATF testing and filter separator maintenance.",
    applyUrl: "https://wingfuel.co/jobs/apply/fuel-qa-blr",
    expiryDate: "2026-12-15",
    status: "published"
  },
  {
    id: "job-02",
    title: "Apron Fuel Hydrant Operations Supervisor",
    company: "Reliance Aviation Fuelling Services",
    location: "Mumbai Chhatrapati Shivaji Airport (BOM)",
    type: "Shift-Based",
    category: "Ground Operations",
    qualifications: "Minimum 4 years supervising airfield dispenser operations, deadman testing, and airport ramp safety compliance.",
    applyUrl: "https://wingfuel.co/jobs/apply/hydrant-super-bom",
    expiryDate: "2026-12-20",
    status: "published"
  },
  {
    id: "job-03",
    title: "Senior Ground Support Equipment Tech (GSE)",
    company: "Air India SATS Airport Services",
    location: "Delhi Indira Gandhi International Airport (DEL)",
    type: "Full-Time",
    category: "Airport Engineering",
    qualifications: "Diploma in Automobile/Mechanical with expertise in diesel refueller chassis, hydraulic boom lifts, and fuel pumps.",
    applyUrl: "https://wingfuel.co/jobs/apply/gse-tech-del",
    expiryDate: "2026-12-10",
    status: "published"
  }
];
