# Security Policy - GIRMAIC HUMANITY

## 🕊️ Our Commitment to Safety

At GIRMAIC HUMANITY, the security and privacy of our reporters, advocates, and contributors are our absolute highest priorities. We utilize rigorous design principles to protect vulnerable individuals who report sensitive, high-impact issues.

This document outlines our security policies, how to report vulnerabilities, and our strict architectural boundaries.

---

## 🛡️ Supported Versions

We actively maintain and support security patches for the following versions:

| Version | Supported |
| ------- | --------- |
| 1.0.x   | ✅ Yes    |
| < 1.0   | ❌ No     |

---

## 🔐 Reporting a Vulnerability

**DO NOT file a public issue on GitHub for security vulnerabilities.**

If you discover a security vulnerability in this platform, please report it privately to our security team. This prevents vulnerable reporters' data from being exposed to potential threats.

### How to Submit a Report
Please email your report to: **security@girmaic-humanity.org** (or use our secure reporting portal).

To help us triage the issue quickly, please include:
1. A detailed description of the vulnerability.
2. Steps to reproduce the issue (proof-of-concept scripts or screenshots, if possible).
3. The potential impact (e.g., privilege escalation, remote code execution, unauthorized report access).

### Our Response Process
- **Triage**: We will acknowledge receipt of your report within 24 hours.
- **Verification**: Our security engineers will analyze and verify the vulnerability.
- **Fix**: We will work on a patch and coordinate a secure deployment.
- **Disclosure**: We follow responsible disclosure practices. We will publish details of the fix once it is successfully deployed and users are secure.

---

## 🔒 Security Architecture Boundaries

### 1. Zero Exposure of API Keys
- All calls to external APIs, including the **Gemini AI Client**, must occur strictly on the **server side**.
- Frontend components must never load or interact with `GEMINI_API_KEY` or other third-party secret tokens. 

### 2. Multi-Role Authorization Enforcements
- Roles like `REVIEWER`, `MODERATOR`, and `ADMIN` are strictly validated on the server side and through **Firebase Firestore Security Rules** (`firestore.rules`).
- Clients are never trusted to specify or elevate user roles in Firestore directly.

### 3. Data Minimization
- The platform is designed to minimize the collection of Personal Identifiable Information (PII).
- Evidence attachments undergo metadata minimization steps (such as stripping GPS EXIF headers) before they are marked for final review.
- Location data is aggregated to a broad regional level on public maps to prevent targeting of specific individuals or communities.
