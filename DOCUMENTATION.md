# Technical Documentation - GIRMAIC HUMANITY

This documentation provides deep technical details regarding the database model, state engines, and API architecture of the **GIRMAIC HUMANITY** platform.

---

## 🏗️ Technical Architecture Overview

GIRMAIC HUMANITY is designed as a secure, full-stack application built for horizontal scaling and rapid offline synchronization.

```text
              ┌──────────────────────────────────────────────────┐
              │                React Frontend UI                 │
              │   (App.tsx, ReportWizard, AdminDashboard, etc.)   │
              └────────┬────────────────────────────────┬────────┘
                       │                                │
        (Protected Firestore Reads)             (Secure API Calls)
                       │                                │
                       ▼                                ▼
         ┌───────────────────────────┐      ┌───────────────────────────┐
         │     Firebase Services     │      │    Express App Server     │
         │ (Auth & Firestore Engine) │      │       (server.ts)         │
         └───────────────────────────┘      └─────────────┬─────────────┘
                                                          │
                                                    (Server Secrets)
                                                          │
                                                          ▼
                                            ┌───────────────────────────┐
                                            │      Gemini 2.5 AI        │
                                            │    (Security Filtered)    │
                                            └───────────────────────────┘
```

---

## 🗄️ Database Schema & Data Models

The platform supports persistent state storage inside Firebase Firestore with the following collection architecture:

### 1. `users` Collection
Tracks authentication metadata and granular roles.
- **Document ID**: `request.auth.uid`
- **Fields**:
  - `id`: `string`
  - `email`: `string`
  - `displayName`: `string`
  - `role`: `UserRole` (e.g., `USER`, `VERIFIED_CONTRIBUTOR`, `REVIEWER`, `MODERATOR`, `ADMIN`, `SUPER_ADMIN`)
  - `preferredLanguage`: `string` (e.g., `en`, `am`, `om`, `so`, `ar`, `fr`)
  - `createdAt`: `string` (ISO Timestamp)

### 2. `reports` Collection
Contains submitted incidents and documentation.
- **Document ID**: Unique hash
- **Fields**:
  - `id`: `string` (e.g., `HR-2026-000001`)
  - `userId`: `string` (Owner ID)
  - `category`: `string` (one of the 20 core categories)
  - `description`: `string` (incident summary)
  - `date`: `string` (date of occurrence)
  - `location`: `string` (general location)
  - `relationship`: `string` (Affected, Witness, Other)
  - `evidence`: `Array<EvidenceItem>`
  - `additionalInfo`: `string`
  - `privacyLevel`: `PrivacyLevel` (e.g., `CONFIDENTIAL`, `RESTRICTED_REVIEW`, `PUBLIC_AGGREGATED`)
  - `status`: `ReportStatus` (e.g., `DRAFT`, `SUBMITTED`, `VERIFIED`, `SAFETY_REVIEW`, etc.)
  - `createdAt`: `string`
  - `updatedAt`: `string`

### 3. `communityPosts` Collection
Forums and sharing.
- **Document ID**: Unique hash
- **Fields**:
  - `id`: `string`
  - `userId`: `string`
  - `authorName`: `string`
  - `title`: `string`
  - `content`: `string`
  - `category`: `string`
  - `likesCount`: `number`
  - `reportsCount`: `number` (moderation trigger)
  - `flagged`: `boolean`
  - `createdAt`: `string`

### 4. `auditLogs` Collection
Immutable log of system modifications.
- **Fields**:
  - `id`: `string`
  - `timestamp`: `string`
  - `action`: `string` (e.g., `ROLE_CHANGE`, `REPORT_VERIFICATION`)
  - `performedBy`: `string` (UID or Email)
  - `targetId`: `string` (User ID or Report ID)
  - `details`: `string`

---

## 🤖 AI Workflow Protocols

### 1. Secure Prompt Boundary
All instructions fed to the model in `server.ts` are strictly wrapped in security bounds to ensure:
- Privacy preservation (preventing prompt leaks or exposure of adjacent client records).
- Strictly non-punitive, informative framing.
- Continuous grounding in official human rights covenants (UDHR).

### 2. AI Incident Categorization
When creating a report, the AI scans the details in the background:
- It runs structured JSON categorizations.
- Flags potential physical risks or accidental inclusions of high-risk PII (like exact names or locations) to guide the client on metadata minimization before final database storage.

---

## ♿ Accessibility Compliance

The application implements WCAG 2.2 AA protocols:
- **ARIA Landmark Roles**: Navigation, main container, section banners, and search portals are semantically marked.
- **Font Scaling**: Dynamically respects custom text-scaling settings to aid visually impaired advocates.
- **High Contrast**: Includes contrast-safety enhancements designed specifically for eye-safe reading in various lighting environments.
