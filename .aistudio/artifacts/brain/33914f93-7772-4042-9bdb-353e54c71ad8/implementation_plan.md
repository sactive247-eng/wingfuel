# WingFuel.co — Complete Aviation Knowledge & Digital Products Platform

WingFuel.co is a production-grade aviation portal and digital product platform featuring semi-automated AI news aggregation, an aviation knowledge library, ground operations manuals, aviation calculators, a digital product store with Razorpay sandbox payments, an aviation careers board, and a secure Firebase-backed administrator control center.

## User Review & Critical Decisions

> [!IMPORTANT]
> The following architectural decisions have been aligned based on your selections:

- **Confirmed Decision 1 (News Aggregation & RSS Feeds)**: Configured with a pre-set mix of top aviation feeds covering Indian & Global Aviation, Airports, Fuel, Aircraft, and Regulations. Semi-automated workflow generates Gemini AI summaries and queues articles for administrator review prior to public release.
- **Confirmed Decision 2 (Digital Products & Payment Verification)**: Built-in Razorpay Sandbox test mode with server-side payment signature verification, generating time-limited access keys for downloadable digital assets (Excel templates, ops dashboards, checklists).
- **Confirmed Decision 3 (AdMob & Banner Monetization)**: Native responsive ad placement slots engineered into news streams, editorial sidebars, calculator tools, ground ops views, and mobile bottom floating strips.
- **Confirmed Decision 4 (Database & Pre-populated Data)**: Pre-populated Firestore database initialized with realistic aviation articles, ATF density correction benchmarks, ground handling checklists, career job listings, and ready-to-download digital product metadata.

---

## 1. Overview & Core Concept

- **What It Does**: WingFuel.co provides a single destination for aviation professionals, refuellers, pilots, airport managers, ground ops crews, and enthusiasts. It offers breaking news, technical ground handling guides, aviation math tools, digital product downloads, and job opportunities.
- **Target Audience**: Aviation operations personnel, airport fuel supervisors, commercial flight crews, aviation job seekers, and industry analysts across India and globally.
- **Key Value**: Delivers authoritative aviation fuel (ATF) standards, practical density correction calculators, operational checklists, verified career listings, and curated news without computational errors or clutter.

---

## 2. User Experience & Visual Design

- **Visual Identity & Color Palette**:
  - **Dominant Neutral Canvas (60%)**: Deep obsidian and navy base (`#0b1329`, `#0f172a`) paired with clean ivory card surfaces (`#ffffff` / `#1e293b`).
  - **Structural Surfaces (30%)**: Sleek hairline borders (`#e2e8f0` / `#334155`) with high-legibility editorial typography.
  - **Accent Budget (10%)**: Aviation Safety Orange (`#f97316` / `#ea580c`) for high-intent CTAs, active indicators, and calculator outputs.
- **Typography**:
  - **Display / Headlines**: *Plus Jakarta Sans* / *Outfit* for crisp editorial authority.
  - **Body Prose**: High-legibility *DM Sans* / *Public Sans* with relaxed leading (`1.7`).
  - **Telemetry & Calculations**: Monospace *JetBrains Mono* with tabular numerals (`tabular-nums`) for density math and volume outputs.
- **Primary Layouts & Modules**:
  1. **Top Bar Contract**: Brand Wordmark (`WingFuel.co`), 8 concise single-line navigation links (`whitespace-nowrap`), and 1 primary Action CTA (`Admin / Login`).
  2. **Home Hero**: Wide aviation runway background split with high-contrast text, quick navigation tiles, trending news ticker, and featured products.
  3. **Module 2 — Aviation News Portal**: Filterable by 8 categories, AI-summarized briefs, original source attribution links, related articles, and RSS ingest queue.
  4. **Module 3 & 4 — Knowledge & Ground Ops**: ATF fundamentals, quality control, density-temperature correction, hydrant systems, fuel sampling, and step-by-step ground checklists.
  5. **Module 5 — Aviation Careers**: Active job postings, filters by company/location/role, experience requirements, direct apply modal, and admin expiration manager.
  6. **Module 6 — Digital Products Store**: Excel templates, ops dashboards, interview prep kits with instant Razorpay test payment modal, secure access keys, and digital downloads.
  7. **Module 7 — Aviation Tools & Calculators**: Validated ASTM D1250 / IP 200 ATF Density Correction Calculator, Temperature, Volume, Mass, Unit Converters, and Abbreviation Dictionary.
  8. **Module 8 — Industry Insights**: Analytical long-form essays on fuel markets, airport infrastructure, and airline trends.
  9. **Module 9 — Secure Admin Panel (`/admin`)**: Firebase Auth login, statistics dashboard, news review queue (approve/edit/reject RSS items), content publisher, product manager, job poster, category editor, subscriber list, and activity audit logs.
  10. **Monetization & Ad Engine**: Native ad banner units embedded seamlessly across desktop and mobile screens (including AdMob mobile bottom anchor).

---

## 3. Key Product Decisions & Trade-Offs

- **Decision 1: Semi-Automated Gemini AI News Ingestion**
  - *Approach*: Server-side proxy fetches configured RSS feeds, checks Firestore for duplicate titles/hashes, invokes Gemini AI to generate 2-paragraph summaries and key takeaways, and places drafts in the `news_review_queue`.
  - *Why*: Guarantees zero unverified AI news publication on the live site while saving 90% of editing effort.
- **Decision 2: Standard ASTM D1250 Aviation Fuel Math**
  - *Approach*: Implements standard thermal expansion equations for Jet A-1 / ATF (reference temp 15°C & 60°F) with explicit formula documentation and valid density range boundaries ($775 \text{ to } 840 \text{ kg/m}^3$).
  - *Why*: Prevents unverified formulas or unsafe refuelling density approximations.
- **Decision 3: Firebase Auth & Firestore Rule Protection**
  - *Approach*: Role-based security rules enforcing public read on `status == "published"` documents, restricting write/update operations exclusively to `request.auth.uid == admin_uid`.

---

## 4. Technical Architecture & Data Strategy

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              WINGFUEL.CO CLIENT                                 │
│                                                                                 │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │ Public Editorial Views│  │ Interactive Tools    │  │ Digital Products Store│  │
│  │ (News, Knowledge, Jobs)│  │ (ATF Density Math)   │  │ (Razorpay Sandbox)   │  │
│  └───────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────────┘  │
│              │                         │                         │              │
└──────────────┼─────────────────────────┼─────────────────────────┼──────────────┘
               │                         │                         │
               ▼                         ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              APPLICATION STATE LAYER                             │
│                                                                                 │
│  ┌───────────────────────┐  ┌──────────────────────┐  ┌──────────────────────┐  │
│  │ Firebase Auth Store   │  │ Firestore Live Sync  │  │ Admin RSS Queue Store│  │
│  └───────────┬───────────┘  └──────────┬───────────┘  └──────────┬───────────┘  │
└──────────────┼─────────────────────────┼─────────────────────────┼──────────────┘
               │                         │                         │
               ▼                         ▼                         ▼
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            BACKEND SERVICES & APIS                              │
│                                                                                 │
│  ┌────────────────────────┐  ┌─────────────────────┐  ┌──────────────────────┐ │
│  │ Firestore Database     │  │ Gemini 3.6 Flash    │  │ Server Express Proxy │ │
│  │ (Articles, News, Jobs) │  │ (AI Summarization)  │  │ (/api/rss, /api/pay) │ │
│  └────────────────────────┘  └─────────────────────┘  └──────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────────┘
```

### Firestore Database Schema Structure

1. **`articles`**: `{ id, title, slug, category, summary, content, author, publishedAt, status, tags, coverImage }`
2. **`news`**: `{ id, title, sourceUrl, sourceName, category, summary, content, publishedAt, status, aiGenerated, approvedBy }`
3. **`newsSources`**: `{ id, name, rssUrl, category, active, lastFetchedAt }`
4. **`products`**: `{ id, title, category, description, priceINR, features[], downloadFileName, previewImage, status }`
5. **`orders`**: `{ id, orderId, paymentId, productTitle, amountINR, customerEmail, accessKey, createdAt, status }`
6. **`jobs`**: `{ id, title, company, location, type, category, qualifications, applyUrl, expiryDate, status }`
7. **`siteSettings`**: `{ id, siteName, logo, seoDescription, contactEmail, socialLinks, adMobEnabled }`
8. **`subscribers`**: `{ id, email, subscribedAt, source }`
9. **`activityLogs`**: `{ id, action, adminEmail, timestamp, details }`
