# GIRMAIC HUMANITY
## Global Human Rights, Justice & Human Dignity Platform

> **ONE HUMANITY. EQUAL DIGNITY. JUSTICE FOR ALL.**
> 
> *“We do not fight people. We fight injustice.”*

---

GIRMAIC HUMANITY is an advanced, production-grade, responsive full-stack platform designed to facilitate secure, responsible human-rights advocacy, education, secure incident documentation, and connection to verified humanitarian legal and support organizations. 

Built with **React, TypeScript, Express, Firebase (Firestore, Authentication), and Gemini AI Integration**, this system represents a modern technological response to structural injustice, systemic discrimination, and human-rights violations globally.

---

## 📖 Table of Contents
1. [Core Mission & Brand Philosophy](#-core-mission--brand-philosophy)
2. [Major Platform Features](#-major-platform-features)
3. [Technology Stack & Architecture](#-technology-stack--architecture)
4. [Project Structure](#-project-structure)
5. [Getting Started (Development)](#-getting-started-development)
6. [Production Build & Server Bundling](#-production-build--server-bundling)
7. [Deployment to Google Cloud Run](#-deployment-to-google-cloud-run)
8. [Firebase Security Model & Rules](#-firebase-security-model--rules)
9. [Responsible AI & Ethics Compliance](#-responsible-ai--ethics-compliance)
10. [Personal & Digital Safety Features](#-personal--digital-safety-features)
11. [Disclaimers](#-disclaimers)

---

## 🕊️ Core Mission & Brand Philosophy

GIRMAIC HUMANITY is founded on the fundamental principle that technology should serve to uphold and elevate human dignity. 

- **Dignity**: Recognizing the inherent worth of every human being.
- **Unity**: Advocating for global, cross-border solidarity.
- **Justice**: Seeking equity, accountability, and the peaceful, lawful correction of systemic wrongs.
- **Technology**: Utilizing secure, high-integrity platforms and AI to organize human-rights awareness.

---

## ⚡ Major Platform Features

### 1. Interactive Landing Dashboard
- Modern, clean dashboard displaying the **20 Core Human-Rights Categories**.
- An **Aggregated, Privacy-Preserving Global Incident Map** displaying trends without compromising vulnerable users.
- Fast accessibility panel for multilingual support and high-contrast styling.

### 2. Multi-Step Secure Reporting Wizard
- A logical 10-step wizard guiding victims or witnesses to document occurrences:
  1. Category select
  2. Description details
  3. Date/Time
  4. Location mapping (privacy-safe)
  5. Personal relationship
  6. Digital evidence attachment
  7. Additional metrics
  8. Mandatory safety disclosures
  9. Privacy levels (Confidential, Restricted Review, Public Aggregation)
  10. Receipt of unique identifier (e.g., `HR-2026-000001`)

### 3. Secured Humanity AI Assistant
- Powered server-side by **Gemini 2.5 Flash** using the official `@google/genai` client SDK.
- Translates information instantly, clarifies rights concepts, assists in drafting reports, and provides educational resources.
- *Strictly constrained to prevent legal advice, criminal declarations, or unauthorized data disclosures.*

### 4. Peaceful Action & Advocacy Center
- Supports active community petitions, legal/humanitarian campaigns, and copyable letter templates to communicate with local ombudsmen or national representatives lawfully.

### 5. Verified Help Directory
- A curated directory of verified local/international legal aid and humanitarian support organizations, categorized by region and focus area.

### 6. Respectful Community Forum
- An educational board for sharing personal experiences and human rights learning, complete with custom user blocking, reporting, and flagging systems.

### 7. Secure Administrative Command Station
- Complete backend and UI panels for authorized inspectors, moderators, and admins to review cases, view audit logs, adjust reports, and toggle user roles. Includes profile simulation toggles for seamless QA testing.

---

## 🛠️ Technology Stack & Architecture

- **Frontend**: React 19, TypeScript, Vite, Tailwind CSS, Motion (Animations), Lucide React (Icons).
- **Backend**: Node.js, Express (configured with custom Vite middleware to serve assets synchronously on the developer container).
- **Database**: Firebase Firestore (NoSQL, secure hierarchical document store).
- **Authentication**: Firebase Authentication (Email/Password, Google Sign-in compatible).
- **AI Engine**: Gemini 2.5 Flash (`@google/genai` API SDK, executed fully server-side for maximum secret-key security).

---

## 📁 Project Structure

```text
├── firebase-applet-config.json # Firebase connection configuration
├── firestore.rules             # Strict Firebase Database access policies
├── server.ts                   # Express server with Vite middleware & Gemini proxy APIs
├── package.json                # Project dependencies and deployment scripts
├── tsconfig.json               # TypeScript compilation guidelines
├── index.html                  # Core HTML structure, og:meta tags
└── src
    ├── App.tsx                 # Core Application layout and tabs router
    ├── types.ts                # Strict TypeScript contracts and human-rights types
    ├── index.css               # Global CSS importing Tailwind CSS
    ├── main.tsx                # Applet mounting entrypoint
    ├── components              # Isolated UI components
    │   ├── AIAssistant.tsx     # Gemini AI interface with constraints
    │   ├── AdminDashboard.tsx  # Admin command, reports review & audit trail
    │   ├── CommunityForum.tsx  # Discussion forum with moderation controls
    │   ├── GetHelp.tsx         # Verified humanitarian organizations directory
    │   ├── HumanRightsMap.tsx  # Aggregated heat maps of incidents
    │   ├── LanguageSelector.tsx# App-wide multi-language dropdown
    │   ├── PeacefulAction.tsx  # Petitions and lawful letter drafts
    │   ├── ProfileManager.tsx  # Profile export, settings & simulated roles
    │   ├── ReportWizard.tsx    # Multi-step reporting engine with safety steps
    │   ├── RightsLibrary.tsx   # Interactive rights documentation
    │   └── SafetyCenter.tsx    # Personal, digital, and reporting security checklists
    ├── data                    # Static reference databases
    │   ├── categories.ts       # Detailed metadata for the 20 rights categories
    │   ├── organizations.ts    # Seeded verified directory records
    │   ├── rightsArticles.ts   # Human rights charter documentation (UDHR, etc.)
    │   └── translations.ts     # Multilingual vocabulary records
    └── lib                     # Library bridges
        ├── firebase.ts         # Secure initialization of Firebase SDK
        └── localDb.ts          # Offline-first secure local database mirror
```

---

## 🚀 Getting Started (Development)

1. **Install Base Dependencies**:
   ```bash
   npm install
   ```

2. **Setup Secrets**:
   Create a `.env` file in the project root:
   ```env
   GEMINI_API_KEY="your-actual-api-key"
   ```

3. **Start the Development Server**:
   ```bash
   npm run dev
   ```
   The application dev server will spin up on **port 3000** (configured for Google Cloud reverse-proxy compatibility).

---

## 📦 Production Build & Server Bundling

To compile both the front-end single-page application and bundle the TypeScript Node server into a single, high-performance, independent production artifact, run:

```bash
npm run build
```

This script:
1. Builds the static React assets into `dist/` using Vite.
2. Compiles `server.ts` to CommonJS `dist/server.cjs` via `esbuild` to solve ES module path resolution constraints and reduce startup latency.

To run the production server locally or in a container:
```bash
npm start
```

---

## ☁️ Deployment to Google Cloud Run

GIRMAIC HUMANITY is fully prepared for containerized hosting using **Google Cloud Run**.

### Quick Deploy via gcloud CLI

Ensure you have the Google Cloud SDK installed and authenticated, then execute:

```bash
# Build and push the container image to Google Artifact Registry, then run it on Cloud Run
gcloud run deploy girmaic-humanity \
  --source . \
  --platform managed \
  --region europe-west2 \
  --allow-unauthenticated \
  --port 3000 \
  --set-env-vars="NODE_ENV=production,GEMINI_API_KEY=your_secret_gemini_api_key"
```

The container automatically utilizes the compiled `dist/server.cjs` binary, serving the application securely and scalably over HTTPS.

---

## 🔒 Firebase Security Model & Rules

Our database operations are locked down using strict granular access rules inside `firestore.rules`.
- Ordinary users cannot view or modify report details belonging to another user.
- Evidence files and metadata are private by default.
- Verification status can only be modified by accounts verified to have `REVIEWER`, `ADMIN`, or `SUPER_ADMIN` roles.
- Role modifications and privileges cannot be self-escalated from the client.

To update or deploy these rules to your Firebase console manually:
```bash
firebase deploy --only firestore:rules
```

---

## ⚖️ Responsible AI & Ethics Compliance

The **GIRMAIC HUMANITY AI** is built on several firm ethical pillars:
1. **Fact vs Allegation**: The AI will never declare an unresolved incident as "guilty" or "proven fact" — it treats incoming documentation as a "reported concern" pending authorized human validation.
2. **Impersonation Prevention**: Clearly states that it is an assistant and cannot provide authorized legal counsel or act as an official law enforcement agency.
3. **Safety Grounding**: Instantly identifies terms relating to physical violence or self-harm and outputs localized, verified emergency guidance prompts.

---

## 🛡️ Personal & Digital Safety Features

- **Quick Exit Button**: Present on sensitive pages. Instantly routes the browser window to a neutral humanitarian educational resource.
- **Client-Side EXIF Stripping**: Metadata minimization guidelines are enforced to prevent vulnerable reporters from accidentally exposing GPS tags on attached JPEG/PNG files.
- **Privacy-by-Design**: Offers multiple levels of privacy to reports, allowing users to control whether their incident should be shared publicly in aggregated statistics or remain readable only by inspectors.

---

## ⚠️ Disclaimers

> *This platform provides educational information, secure documentation assistance, and connections to verified resources. It does not replace professional legal advice, emergency services, judicial courts, national law enforcement, or qualified humanitarian rescue organizations.*
