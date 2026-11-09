# WingFuel.co — Complete AI Agent & Multi-Tool Handoff Documentation

> **Notice to AI Assistants & Tools (ChatGPT, Claude, Cursor, GitHub Copilot, AI Studio, etc.)**:  
> Read this file first before making changes to this repository. This document contains the single source of truth for application state, architecture, Firebase configuration, UI design system rules, and component patterns.

---

## 1. Project Overview & Identity
- **Brand & Domain**: WingFuel.co (`https://wingfuel.co`)
- **Niche**: Aviation Jet Fuel (ATF), Airport Ground Operations, Density & Temperature Calculations, Aviation News Aggregation, Technical Knowledge Base, and Digital Aviation Toolkits/Templates.
- **Primary Color**: Aviation Orange (`#f97316` / `orange-500`) and Navy/Slate tones.
- **Theme Support**: Dual Theme (Light & Dark Mode) using Tailwind CSS v4 `@custom-variant dark (&:where(.dark, .dark *));`. Theme setting is persisted in `localStorage` under `wingfuel_theme`.

---

## 2. Infrastructure & Firebase Credentials
- **Active Firebase Project ID**: `wingfuel-1f48d`
- **Firestore Database ID**: `ai-studio-33914f93-7772-4042-9bdb-353e54c71ad8`
- **Config File**: `/firebase-applet-config.json` (contains `projectId`, `appId`, `apiKey`, `authDomain`, `firestoreDatabaseId`)
- **Authentication**: Firebase Auth (Google Sign-In via `signInWithPopup` and Email/Password with User Profiles stored in Firestore `users/{uid}`).
- **Security Rules File**: `/firestore.rules` (deployed via Firebase CLI / AI Studio).
- **Deployment CI/CD**: `.github/workflows/firebase-hosting-deploy.yml` (GitHub Actions workflow deploying to Firebase Hosting on push to `main`).

---

## 3. Technology Stack
- **Framework**: React 18 (Functional Hooks) + Vite SPA
- **Styling**: Tailwind CSS v4 (`@import "tailwindcss";` in `src/index.css`)
- **Icons**: `lucide-react`
- **Backend / DB**: Firebase Firestore & Firebase Auth
- **AI Integration**: Server-side proxy & client modals using `@google/genai` (Gemini 3 Pro visual generator for aviation graphics)

---

## 4. Key Implemented Features & Modules

### 4.1 ATF Density & Temperature Calculator (`/src/pages/ToolsPage.tsx` & `/src/pages/OperationsPage.tsx`)
- Standard density calculation at observed temperature to standard 15°C / 60°F reference.
- Mass/volume conversions (Liters, Gallons, Metric Tons, Kilograms, Pounds).
- Includes density validation and quick calculation tools.

### 4.2 Aviation News Aggregator & RSS Summaries (`/src/pages/NewsPage.tsx`)
- Fetches aviation news feeds (DGCA, IATA, FAA, Airport Tech).
- Gemini-powered summaries with category filtering ('Fuel', 'Regulations', 'Safety', 'Operations').
- Favorite/Bookmark toggle saving to `localStorage`.

### 4.3 Aviation Knowledge Base Library (`/src/pages/KnowledgePage.tsx`)
- Long-form technical articles (QC sampling, hydrant refueling, SAF standards, filter separators).
- Includes top scroll-based `ReadingProgressBar` component for long articles.
- Search filter and category tags.

### 4.4 Category Alert Preferences (`/src/components/NotificationSettingsModal.tsx`)
- Users subscribe to specific categories ('Fuel', 'Regulations', etc.).
- Preferences persisted to Firestore database under user configuration.

### 4.5 Digital Products & Razorpay Sandbox (`/src/pages/ProductsPage.tsx`)
- Digital templates (ATF Logbooks, Inspection Checklists, Fuel Quality Spreadsheets).
- Integrated Razorpay Sandbox checkout flow allowing instant test downloads upon mock payment success.

### 4.6 Global Search Modal (`/src/components/GlobalSearchModal.tsx`)
- Triggered by `⌘K` or `Ctrl+K` or search bar.
- Queries articles, news, and digital products simultaneously.

### 4.7 AdMob Integration (`/src/components/AdBanner.tsx`)
- Google AdMob slots (`pub-2011257851590169`) embedded across key sections and mobile sticky footer anchor banner.

---

## 5. Repository File Structure

```
├── .github/
│   └── workflows/
│       └── firebase-hosting-deploy.yml # GitHub Actions deployment to Firebase
├── public/
│   └── assets/
│       └── aistudio/
│           └── WingFuel_Orbit_Logo_e3f91314.png # Transparent WingFuel logo
├── src/
│   ├── components/
│   │   ├── AdBanner.tsx                # Google AdMob slots
│   │   ├── Footer.tsx                  # Dual theme footer + newsletter form
│   │   ├── GeminiImageGenModal.tsx    # Gemini AI image generator
│   │   ├── GlobalSearchModal.tsx      # Global catalog search modal
│   │   ├── Navbar.tsx                  # Sticky header, logo, theme toggle, auth
│   │   ├── NotificationSettingsModal.tsx # Alert category preferences
│   │   ├── ReadingProgressBar.tsx      # Reading scroll progress bar
│   │   └── UserAuthModal.tsx           # Google & Email/Password Sign Up / Sign In
│   ├── lib/
│   │   ├── firebase.ts                 # Firebase app, auth, db initializations
│   │   └── seedData.ts                 # Initial articles, news, products & jobs
│   ├── pages/
│   │   ├── AboutPage.tsx               # About, Terms, Privacy Policy
│   │   ├── AdminDashboard.tsx          # Admin content management & approval
│   │   ├── HomePage.tsx                # Hero section, features, tools spotlight
│   │   ├── InsightsPage.tsx            # Market insights & SAF trends
│   │   ├── JobsPage.tsx                # Aviation careers board
│   │   ├── KnowledgePage.tsx           # Technical library
│   │   ├── NewsPage.tsx                # Aggregated aviation news
│   │   ├── OperationsPage.tsx          # Ground ops & density tools
│   │   ├── ProductsPage.tsx            # Digital products store
│   │   └── ToolsPage.tsx               # ATF density calculator tool
│   ├── App.tsx                         # Main app router, theme state, modals
│   ├── index.css                       # Tailwind v4 setup & fonts
│   └── main.tsx                        # React entry point
├── firebase-applet-config.json         # Firebase project configuration
├── firebase.json                       # Firebase hosting & rules config
├── firestore.rules                     # Production Firestore security rules
├── package.json                        # App dependencies & scripts
├── vite.config.ts                      # Vite build configuration
└── PROJECT_STATE.md                    # THIS FILE (AI Agent State & Rules)
```

---

## 6. Guidelines for AI Assistants & Contributors

1. **Do Not Overwrite `firebase-applet-config.json`**: Always use project `wingfuel-1f48d` and database `ai-studio-33914f93-7772-4042-9bdb-353e54c71ad8`.
2. **Maintain Theme Discipline**: All new components must support both light mode and dark mode using Tailwind `dark:...` classes.
3. **Keep Real Data Integration**: Use real Firebase authentication (`auth`) and Firestore calls (`db`). Do not replace working APIs with static mock fallbacks.
4. **Update `PROJECT_STATE.md`**: Whenever you add a new page, feature, or database collection, update this file so future AI sessions stay synchronized.
