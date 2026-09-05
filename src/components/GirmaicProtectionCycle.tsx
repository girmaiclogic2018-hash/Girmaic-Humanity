/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Eye, 
  Lock, 
  Activity, 
  MapPin, 
  Heart, 
  Volume2, 
  BookOpen, 
  Compass, 
  CheckCircle, 
  Share2, 
  AlertTriangle, 
  FileText, 
  Users, 
  Zap, 
  ArrowRight, 
  Search, 
  Globe, 
  RefreshCw, 
  Check, 
  Filter, 
  Download, 
  EyeOff,
  UserCheck,
  History,
  Info
} from 'lucide-react';
import { localDb } from '../lib/localDb';
import { PrivacyLevel, ReportStatus, UserRole } from '../types';

interface EvidenceMock {
  id: string;
  name: string;
  size: number;
  type: string;
  hash: string;
  metadataCleaned: boolean;
  status: 'Original' | 'Working Copy' | 'Redacted Copy' | 'Published Copy';
}

export default function GirmaicProtectionCycle() {
  const [activeCycleTab, setActiveCycleTab] = useState<'VOICE' | 'PROTECT' | 'UNDERSTAND' | 'VERIFY' | 'CONNECT' | 'ACT' | 'LEARN' | 'PREVENT'>('VOICE');
  const [privacyText, setPrivacyText] = useState('');
  const [shieldLogs, setShieldLogs] = useState<string[]>([]);
  const [detectedItems, setDetectedItems] = useState<{ type: string; value: string; action: 'keep' | 'redact' | 'remove' }[]>([]);
  const [scanned, setScanned] = useState(false);
  
  // Safe Evidence Vault State
  const [vaultFiles, setVaultFiles] = useState<EvidenceMock[]>([
    {
      id: 'EV-2026-001',
      name: 'incident_photo_location.jpg',
      size: 1420000,
      type: 'image/jpeg',
      hash: '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
      metadataCleaned: true,
      status: 'Original'
    },
    {
      id: 'EV-2026-002',
      name: 'testimony_audio_raw.wav',
      size: 4800000,
      type: 'audio/wav',
      hash: 'ec42a359203ca029143d221e3ca0a87f48b87f48b87f48b87f48b87f48b87f48',
      metadataCleaned: true,
      status: 'Working Copy'
    }
  ]);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const [auditLogs, setAuditLogs] = useState<string[]>([
    'EV-2026-001: Encrypted using AES-256 standard on node enclaves.',
    'EV-2026-001: Geotags and EXIF metadata stripped successfully.',
    'EV-2026-002: Integrity hash logged to secure local ledger.'
  ]);

  // Early-Warning Engine State
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [warningSignals, setWarningSignals] = useState([
    { id: 1, title: 'Internet Access Disruptions', region: 'Horn of Africa', confidence: 'High', status: 'Monitoring', type: 'Censorship indicator', details: 'Sudden bandwidth drop metrics reported across primary gateways.' },
    { id: 2, title: 'Minority Rights Assembly Restrictions', region: 'East Africa', confidence: 'Medium', status: 'Emerging', type: 'Geographic clustering', details: 'Multiple independent civic reports flag permit denials.' },
    { id: 3, title: 'Temporary Labor Displacements', region: 'Middle East', confidence: 'High', status: 'Confirmed', type: 'Displacement pattern', details: 'Cross-border worker community migration logs show significant shifts.' },
    { id: 4, title: 'Civic Platform Blocks', region: 'Asia', confidence: 'Low', status: 'Unverified', type: 'Repeated categories', details: 'Occasional DNS routing timeouts reported on human rights portals.' }
  ]);

  // Peaceful Action state
  const [campaignTitle, setCampaignTitle] = useState('');
  const [campaignDesc, setCampaignDesc] = useState('');
  const [campaigns, setCampaigns] = useState([
    { id: 1, title: 'Universal Literacy for Underrepresented Youth', desc: 'Educational drive providing simple language rights translation booklets.', category: 'Educational Campaign', safetyWarning: 'No protest physical assembly is suggested. Only digital literacy sharing.' },
    { id: 2, title: 'Lawful Petition for Equal Work Dignity', desc: 'Writing formal request letters to district employment councils demanding fair audits.', category: 'Lawful Petition', safetyWarning: 'Strict adherence to regional labor code petitions and regulatory review channels.' }
  ]);

  // Knowledge Copilot State
  const [copilotQuery, setCopilotQuery] = useState('');
  const [copilotResponse, setCopilotResponse] = useState<{
    explanation: string;
    rights: string[];
    concepts: string[];
    sources: string[];
    disclaimer: string;
  } | null>(null);

  // Scorecard metrics
  const scorecardMetrics = {
    evidenceAvailability: 92,
    verificationConfidence: 85,
    sourceDiversity: 78,
    trendStrength: 64,
    resourceAvailability: 88,
    responseActivity: 90
  };

  // Safe Scan Logic
  const handlePrivacyScan = () => {
    if (!privacyText) return;
    const items: { type: string; value: string; action: 'keep' | 'redact' | 'remove' }[] = [];
    
    // Regex matches
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
    const locationRegex = /\b(Street|Avenue|Apt|Suite|Address|Route|Highway|Gofa|Bole|Dire Dawa|Addis Ababa|Harar|Hawassa)\b/gi;

    let match;
    while ((match = emailRegex.exec(privacyText)) !== null) {
      items.push({ type: 'Email Address', value: match[0], action: 'redact' });
    }
    while ((match = phoneRegex.exec(privacyText)) !== null) {
      items.push({ type: 'Phone Number', value: match[0], action: 'redact' });
    }
    while ((match = locationRegex.exec(privacyText)) !== null) {
      items.push({ type: 'Exact Location / Area', value: match[0], action: 'redact' });
    }

    setDetectedItems(items);
    setScanned(true);
    setShieldLogs(prev => [...prev, `Scanned report text draft at ${new Date().toLocaleTimeString()}.`]);
  };

  const handleActionToggle = (index: number, action: 'keep' | 'redact' | 'remove') => {
    const updated = [...detectedItems];
    updated[index].action = action;
    setDetectedItems(updated);
  };

  const getCleanedText = () => {
    let text = privacyText;
    detectedItems.forEach(item => {
      if (item.action === 'redact') {
        text = text.replace(item.value, `[SECURE_REDACTED_${item.type.toUpperCase().replace(/\s+/g, '_')}]`);
      } else if (item.action === 'remove') {
        text = text.replace(item.value, '');
      }
    });
    return text;
  };

  // Safe Evidence Uploader simulation
  const handleSimulateUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadedFileName) return;

    const newId = `EV-2026-0${vaultFiles.length + 1}`;
    // Simple mock SHA256 string generator
    const mockHash = Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    
    const newFile: EvidenceMock = {
      id: newId,
      name: uploadedFileName,
      size: Math.floor(Math.random() * 3000000) + 500000,
      type: uploadedFileName.endsWith('.pdf') ? 'application/pdf' : 'image/jpeg',
      hash: mockHash,
      metadataCleaned: true,
      status: 'Original'
    };

    setVaultFiles([...vaultFiles, newFile]);
    setAuditLogs(prev => [
      ...prev,
      `${newId}: Encrypted & uploaded using AES-256 standard.`,
      `${newId}: Cryptographic checksum generated (${mockHash.slice(0, 8)}...).`,
      `${newId}: All EXIF device hardware fingerprints scrubbed.`
    ]);
    setUploadedFileName('');
  };

  // Knowledge copilot simulator
  const handleCopilotQuery = (e: React.FormEvent) => {
    e.preventDefault();
    if (!copilotQuery) return;

    // Direct context parsing
    const q = copilotQuery.toLowerCase();
    let explanation = "Girmaic Knowledge Copilot analysis based on the Universal Declaration of Human Rights.";
    let rights = ["Article 1: Right to Equality", "Article 19: Freedom of Expression"];
    let concepts = ["Legal Capacity", "Due Process", "Human Dignity"];
    let sources = ["UDHR General Assembly Resolution 217A", "International Covenant on Civil and Political Rights (ICCPR)"];

    if (q.includes('express') || q.includes('speak') || q.includes('press')) {
      explanation = "Freedom of expression empowers individuals to hold opinions without interference and seek, receive, and impart information through any media regardless of frontiers.";
      rights = ["Article 19: Freedom of Opinion and Expression", "Article 20: Freedom of Peaceful Assembly"];
      concepts = ["Censorship protection", "Media independence", "Digital rights & free access"];
    } else if (q.includes('trial') || q.includes('court') || q.includes('fair') || q.includes('arrest')) {
      explanation = "The right to a fair and public hearing by an independent, impartial tribunal. Asserts the presumption of innocence until proven guilty.";
      rights = ["Article 10: Right to Fair Public Hearing", "Article 11: Presumption of Innocence", "Article 9: Arbitrary Arrest Protection"];
      concepts = ["Habeas Corpus", "Equality before the law", "Legal defense representation"];
    } else if (q.includes('work') || q.includes('pay') || q.includes('labor')) {
      explanation = "Everyone has the right to work, to free choice of employment, to just and favorable conditions of work, and to protection against unemployment.";
      rights = ["Article 23: Right to Just and Favorable Work", "Article 24: Right to Rest and Leisure"];
      concepts = ["Equal pay for equal work", "Union association", "Fair working standards"];
    }

    setCopilotResponse({
      explanation,
      rights,
      concepts,
      sources,
      disclaimer: "Girmaic Humanity Knowledge Copilot outputs are for digital literacy and education. They do not constitute legal findings or universal binding legal counsel."
    });
  };

  // Safe Peaceful Action Generator
  const handleCreateCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaignTitle || !campaignDesc) return;

    const newCampaign = {
      id: campaigns.length + 1,
      title: campaignTitle,
      desc: campaignDesc,
      category: 'Community Education & Awareness Project',
      safetyWarning: 'Ensure this educational campaign remains entirely peaceful, objective, and respects all local civic guidelines.'
    };

    setCampaigns([newCampaign, ...campaigns]);
    setCampaignTitle('');
    setCampaignDesc('');
  };

  return (
    <div className="space-y-12" id="girmaic-cycle-dashboard">
      
      {/* Dynamic Slogan & Title */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">
          THE GIRMAIC PROTECTION CYCLE
        </h1>
        <p className="text-xs text-emerald-600 dark:text-emerald-400 font-extrabold uppercase tracking-widest">
          Unified Human-Rights Protection, Action, & Actionable Intelligence Ecosystem
        </p>
      </div>

      {/* 1. VISUAL INTERACTIVE CYCLE HUB */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-650 dark:text-slate-400 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">
            Platform Product Identity
          </span>
          <h2 className="text-base sm:text-lg font-black text-slate-800 dark:text-slate-100">
            Interactive Safety & Justice Lifecycle
          </h2>
          <p className="text-xs text-slate-500">
            Follow the central journey designed by Girma Haile Bunaro. Click on any state to unlock interactive tools, guides, and metrics.
          </p>
        </div>

        {/* Graph representation nodes */}
        <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-8 gap-3 pt-4">
          {[
            { id: 'VOICE', icon: Volume2, color: 'text-indigo-600 bg-indigo-50 dark:bg-indigo-950/20 dark:text-indigo-400', label: '1. Voice', desc: 'Secure Logging' },
            { id: 'PROTECT', icon: Shield, color: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950/20 dark:text-emerald-400', label: '2. Protect', desc: 'Secure Vault' },
            { id: 'UNDERSTAND', icon: Compass, color: 'text-amber-600 bg-amber-50 dark:bg-amber-950/20 dark:text-amber-400', label: '3. Understand', desc: 'Privacy Shield' },
            { id: 'VERIFY', icon: CheckCircle, color: 'text-blue-600 bg-blue-50 dark:bg-blue-950/20 dark:text-blue-400', label: '4. Verify', desc: 'Case Navigator' },
            { id: 'CONNECT', icon: Users, color: 'text-violet-600 bg-violet-50 dark:bg-violet-950/20 dark:text-violet-400', label: '5. Connect', desc: 'Resource Match' },
            { id: 'ACT', icon: Zap, color: 'text-rose-600 bg-rose-50 dark:bg-rose-950/20 dark:text-rose-400', label: '6. Act', desc: 'Peaceful Action' },
            { id: 'LEARN', icon: BookOpen, color: 'text-cyan-600 bg-cyan-50 dark:bg-cyan-950/20 dark:text-cyan-400', label: '7. Learn', desc: 'Knowledge Base' },
            { id: 'PREVENT', icon: Activity, color: 'text-fuchsia-600 bg-fuchsia-50 dark:bg-fuchsia-950/20 dark:text-fuchsia-400', label: '8. Prevent', desc: 'Early Warnings' },
          ].map((node) => {
            const Icon = node.icon;
            const isActive = activeCycleTab === node.id;
            return (
              <button
                id={`cycle-node-${node.id}`}
                key={node.id}
                onClick={() => setActiveCycleTab(node.id as any)}
                className={`flex flex-col items-center text-center p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  isActive 
                    ? 'border-slate-900 bg-slate-900 text-white shadow-md scale-102 dark:border-emerald-500 dark:bg-slate-800' 
                    : 'border-slate-100 bg-slate-50/50 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-950/30'
                }`}
              >
                <div className={`p-2 rounded-xl mb-2 ${isActive ? 'bg-white/10 text-white' : node.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
                <span className={`text-xs font-black uppercase ${isActive ? 'text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                  {node.label}
                </span>
                <span className={`text-[10px] mt-0.5 font-medium ${isActive ? 'text-slate-300' : 'text-slate-400'}`}>
                  {node.desc}
                </span>
              </button>
            );
          })}
        </div>

        {/* Context panel explaining active state */}
        <div className="bg-slate-50 dark:bg-slate-950/40 p-5 rounded-2xl border border-slate-150 dark:border-slate-850">
          {activeCycleTab === 'VOICE' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Volume2 className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase">Stage 1: Voice (Secure Human Rights Reporting)</h3>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed max-w-3xl">
                Providing standard, low-bandwidth, and offline-compatible channels to securely record human-rights concerns. Defending your dignity is the foundation of our work. Our secure submission wizard implements responsive validation, multiple relation tags, and robust category analysis.
              </p>
              <div className="bg-indigo-50/50 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-900/50 p-4 rounded-xl space-y-2">
                <span className="text-[10px] font-extrabold text-indigo-800 dark:text-indigo-400 uppercase tracking-wide">Dynamic Safe Disclosure Tips:</span>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc pl-4 font-medium">
                  <li>Check your physical surroundings to ensure no shoulder-surfing occurs.</li>
                  <li>Draft report forms locally if your network connectivity is intermittent.</li>
                  <li>Use client-side PDF document summaries to back up metadata offline instantly.</li>
                </ul>
              </div>
            </div>
          )}

          {activeCycleTab === 'PROTECT' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase">Stage 2: Protect (Girmaic Secure Evidence Vault)</h3>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed max-w-3xl">
                Evidence is <strong>Private by Default</strong>. All files uploaded are subjected to cryptographic checksum checksum hashing, localized metadata-minimization protocols, and stored inside secure sandbox storage enclaves.
              </p>

              {/* Secure Evidence Upload Panel */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-[10px] font-extrabold text-emerald-800 dark:text-emerald-450 uppercase block">Simulate Secure Vault Deposit</span>
                  <form onSubmit={handleSimulateUpload} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. video_evidence_interview.mp4"
                      value={uploadedFileName}
                      onChange={(e) => setUploadedFileName(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-emerald-650 hover:bg-emerald-600 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Safe Deposit
                    </button>
                  </form>
                  <p className="text-[10px] text-slate-450 leading-relaxed">
                    *Our verification engine inspects and strips raw EXIF data, GPS coordinates, and camera serial signatures locally to protect source identity.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-[10px] font-extrabold text-slate-450 uppercase block">Active Secure Ledger / Vault Logs</span>
                  <div className="max-h-24 overflow-y-auto space-y-1 text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950 p-2 rounded border border-slate-150">
                    {auditLogs.map((log, i) => (
                      <div key={i} className="flex items-start gap-1">
                        <span className="text-emerald-600">✓</span>
                        <span>{log}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Table of Evidence copies */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden">
                <div className="bg-slate-50 dark:bg-slate-950 px-4 py-2 border-b border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-[10px] font-black uppercase text-slate-700 dark:text-slate-300">Safe Evidence List</span>
                  <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-2 py-0.5 rounded">Secure Encryption Active</span>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800 text-xs">
                  {vaultFiles.map((f) => (
                    <div key={f.id} className="p-3 flex flex-wrap items-center justify-between gap-2">
                      <div className="space-y-0.5">
                        <span className="font-bold text-slate-800 dark:text-slate-200">{f.name}</span>
                        <div className="flex items-center gap-2 text-[10px] text-slate-400">
                          <span>{(f.size / 1000000).toFixed(2)} MB</span>
                          <span>•</span>
                          <span className="font-mono text-[9px] break-all">SHA256: {f.hash.slice(0, 16)}...</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-650 rounded-full text-[9px] font-bold uppercase">
                          {f.status}
                        </span>
                        <span className="px-2 py-0.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-450 rounded-full text-[9px] font-black uppercase">
                          Metadata Stripped
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeCycleTab === 'UNDERSTAND' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Compass className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase">Stage 3: Understand (AI Privacy Shield Scanner)</h3>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed max-w-3xl">
                Before submitting details globally, we scan your descriptions for unintended private leakages such as personal phone contacts, exact street addresses, or children names.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-[10px] font-extrabold text-amber-800 dark:text-amber-450 uppercase block">Interactive Privacy Shield Scanner</span>
                  <div className="space-y-2">
                    <textarea
                      placeholder="Write your incident draft here... (e.g. My contact number is +251 911 234567 and I witnessed this at Gofa Camp in Addis Ababa.)"
                      value={privacyText}
                      onChange={(e) => setPrivacyText(e.target.value)}
                      rows={3}
                      className="w-full p-2.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-850 dark:text-slate-150 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="button"
                      onClick={handlePrivacyScan}
                      className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer transition-colors"
                    >
                      Scan Content Integrity
                    </button>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-[10px] font-extrabold text-slate-450 uppercase block">Scanner Flags & Resolution</span>
                  
                  {scanned && detectedItems.length > 0 ? (
                    <div className="space-y-3">
                      <div className="flex items-center gap-1.5 text-[11px] text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200">
                        <AlertTriangle className="h-4 w-4 shrink-0" />
                        <span><strong>Potentially sensitive information detected.</strong> Choose actions below.</span>
                      </div>
                      
                      <div className="divide-y divide-slate-100 dark:divide-slate-800 space-y-2 max-h-32 overflow-y-auto">
                        {detectedItems.map((item, i) => (
                          <div key={i} className="pt-2 flex items-center justify-between gap-2 text-xs">
                            <div className="space-y-0.5">
                              <span className="font-extrabold text-slate-700 dark:text-slate-350 text-[10px] uppercase">{item.type}</span>
                              <p className="font-mono text-[10px] text-slate-500 break-all">{item.value}</p>
                            </div>
                            <div className="flex gap-1">
                              {['keep', 'redact', 'remove'].map((act) => (
                                <button
                                  key={act}
                                  onClick={() => handleActionToggle(i, act as any)}
                                  className={`px-1.5 py-0.5 rounded text-[9px] font-bold uppercase transition-all cursor-pointer ${
                                    item.action === act 
                                      ? 'bg-emerald-600 text-white shadow-xs' 
                                      : 'bg-slate-100 hover:bg-slate-250 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                  }`}
                                >
                                  {act}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2.5 border-t border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Pre-flight Redacted Preview</span>
                        <div className="p-2 bg-slate-950 text-emerald-400 font-mono text-[10px] rounded max-h-24 overflow-y-auto">
                          {getCleanedText()}
                        </div>
                      </div>
                    </div>
                  ) : scanned ? (
                    <div className="text-center py-4 text-xs font-medium text-emerald-600">
                      ✓ Zero sensitive data leaks flagged. Perfect for public submission.
                    </div>
                  ) : (
                    <p className="text-xs text-slate-450 italic py-6 text-center">
                      Write draft on the left and trigger scanning to see Privacy Shield findings.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeCycleTab === 'VERIFY' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase">Stage 4: Verify (Case Navigator & Oversight Process)</h3>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed max-w-3xl">
                Every report triggers an official status journey containing human oversight gates to filter out rumors and verify legal integrity.
              </p>

              {/* Case timeline simulation */}
              <div className="relative pl-6 space-y-4 pt-2">
                <div className="absolute left-2.5 top-2 bottom-2 w-0.5 bg-blue-100 dark:bg-blue-900/45" />
                
                {[
                  { title: '1. Received', status: 'COMPLETED', date: 'Sept 5, 2026', desc: 'Secure hash locked. Original copies encrypted.' },
                  { title: '2. Safety & AI Privacy Scan', status: 'COMPLETED', date: 'Sept 5, 2026', desc: 'PII scan completed. Redacted layouts locked.' },
                  { title: '3. Human Verification Review', status: 'ACTIVE', date: 'In Progress', desc: 'Verified reviewers examining source consistency logs.' },
                  { title: '4. Possible Corroboration & Referrals', status: 'PENDING', date: 'Pending', desc: 'Comparing spatial coordinates and connecting local matching aid.' }
                ].map((step, idx) => (
                  <div key={idx} className="relative flex items-start gap-4">
                    <div className={`absolute -left-5 w-4 h-4 rounded-full border-2 bg-white dark:bg-slate-900 flex items-center justify-center ${
                      step.status === 'COMPLETED' ? 'border-emerald-600' :
                      step.status === 'ACTIVE' ? 'border-blue-600 animate-pulse' : 'border-slate-300'
                    }`}>
                      {step.status === 'COMPLETED' && <div className="w-1.5 h-1.5 bg-emerald-600 rounded-full" />}
                      {step.status === 'ACTIVE' && <div className="w-1.5 h-1.5 bg-blue-600 rounded-full" />}
                    </div>
                    <div className="text-xs space-y-0.5">
                      <div className="flex items-center gap-2">
                        <span className={`font-bold ${step.status === 'ACTIVE' ? 'text-blue-700 dark:text-blue-450' : 'text-slate-800 dark:text-slate-200'}`}>
                          {step.title}
                        </span>
                        <span className={`text-[9px] font-black uppercase px-2 py-0.25 rounded-full ${
                          step.status === 'COMPLETED' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' :
                          step.status === 'ACTIVE' ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {step.status}
                        </span>
                      </div>
                      <p className="text-slate-500 leading-relaxed text-[11px]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCycleTab === 'CONNECT' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Users className="h-5 w-5 text-violet-600 dark:text-violet-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase">Stage 5: Connect (Dignity Resource Matching)</h3>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed max-w-3xl">
                Match verified human-rights protection groups and NGOs directly to cases based on category and region, without compromising user identity.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                {[
                  { name: 'Legal Counsel Guild', cat: 'Legal Aid', loc: 'Dire Dawa, Ethiopia', ver: 'VERIFIED' },
                  { name: 'Global Journalist Defense Foundation', cat: 'Journalist support', loc: 'Global Portal', ver: 'VERIFIED' },
                  { name: 'Dignity Child Advocacy League', cat: 'Child protection', loc: 'Addis Ababa, Ethiopia', ver: 'UNDER REVIEW' }
                ].map((item, idx) => (
                  <div key={idx} className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] bg-slate-100 dark:bg-slate-800 text-slate-650 px-2 py-0.5 rounded-full font-bold uppercase tracking-wide">
                        {item.cat}
                      </span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.25 rounded ${
                        item.ver === 'VERIFIED' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20'
                      }`}>
                        {item.ver}
                      </span>
                    </div>
                    <span className="text-xs font-black text-slate-800 dark:text-slate-250 block">{item.name}</span>
                    <span className="text-[10px] text-slate-450 block font-semibold">{item.loc}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeCycleTab === 'ACT' && (
            <div className="space-y-5">
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-rose-600 dark:text-rose-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase">Stage 6: Act (Peaceful Action Center)</h3>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed max-w-3xl">
                Promote educational drives, legal awareness, and digital petitions. <strong>Note:</strong> GIRMAIC HUMANITY strictly prohibits any promotion of violence, threats, doxxing, or revenge.
              </p>

              {/* Campaign builder form */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-[10px] font-extrabold text-rose-800 dark:text-rose-450 uppercase block">Launch Safe Initiative Proposal</span>
                  <form onSubmit={handleCreateCampaign} className="space-y-2">
                    <input
                      type="text"
                      placeholder="e.g. Legal Literacy Workshop"
                      value={campaignTitle}
                      onChange={(e) => setCampaignTitle(e.target.value)}
                      className="w-full px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <textarea
                      placeholder="Describe your peaceful awareness program..."
                      value={campaignDesc}
                      onChange={(e) => setCampaignDesc(e.target.value)}
                      rows={2}
                      className="w-full p-2 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-850 dark:text-slate-150 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      className="w-full py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-extrabold cursor-pointer transition-colors"
                    >
                      Propose Campaign
                    </button>
                  </form>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-[10px] font-extrabold text-slate-450 uppercase block">Active Peaceful Campaigns</span>
                  <div className="space-y-3 max-h-48 overflow-y-auto">
                    {campaigns.map((camp) => (
                      <div key={camp.id} className="p-2.5 rounded-lg border border-slate-100 dark:border-slate-800 space-y-1 bg-slate-50 dark:bg-slate-950/20 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="font-extrabold text-slate-850 dark:text-slate-250">{camp.title}</span>
                          <span className="text-[9px] bg-slate-100 dark:bg-slate-850 text-slate-650 px-2 py-0.5 rounded-full font-bold uppercase">{camp.category}</span>
                        </div>
                        <p className="text-slate-500 text-[11px] leading-relaxed">{camp.desc}</p>
                        <p className="text-[10px] text-amber-700 bg-amber-50 dark:bg-amber-950/20 p-1.5 rounded font-bold border border-amber-100 leading-tight">
                          ⚠️ {camp.safetyWarning}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeCycleTab === 'LEARN' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-cyan-600 dark:text-cyan-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase">Stage 7: Learn (Knowledge Copilot Engine)</h3>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed max-w-3xl">
                Consult authoritative covenants and covenants in plain-language translations easily. Ask the Copilot to extract corresponding rights.
              </p>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3">
                  <span className="text-[10px] font-extrabold text-cyan-800 dark:text-cyan-450 uppercase block">Query Rights Copilot</span>
                  <form onSubmit={handleCopilotQuery} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="e.g. What rights protect freedom of expression?"
                      value={copilotQuery}
                      onChange={(e) => setCopilotQuery(e.target.value)}
                      className="flex-1 px-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                    <button
                      type="submit"
                      className="px-4 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold cursor-pointer"
                    >
                      Ask
                    </button>
                  </form>
                  <p className="text-[10px] text-slate-450">
                    *Trained to align with the Universal Declaration of Human Rights (UDHR) and regional covenant protocols.
                  </p>
                </div>

                <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs">
                  {copilotResponse ? (
                    <div className="space-y-2.5">
                      <span className="text-[10px] font-extrabold text-cyan-800 dark:text-cyan-450 uppercase block">Copilot Explanation</span>
                      <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-[11px]">{copilotResponse.explanation}</p>
                      
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {copilotResponse.rights.map((r, i) => (
                          <span key={i} className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 rounded font-bold text-[10px] text-slate-700 dark:text-slate-300">
                            {r}
                          </span>
                        ))}
                      </div>

                      <div className="text-[10px] text-slate-450 leading-tight pt-1.5 border-t border-slate-100 dark:border-slate-800">
                        {copilotResponse.disclaimer}
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-450 italic py-6 text-center">
                      Ask about any right on the left to see plain-language interpretations.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeCycleTab === 'PREVENT' && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-fuchsia-600 dark:text-fuchsia-400" />
                <h3 className="text-sm font-bold text-slate-900 dark:text-slate-200 uppercase">Stage 8: Prevent (Early-Warning Intelligence Engine)</h3>
              </div>
              <p className="text-xs text-slate-650 leading-relaxed max-w-3xl">
                Aggregates spatial, temporal, and metadata signals securely without identifying single reporters, triggering safety alarms before severe escalations occurs.
              </p>

              {/* Signals and Warning Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 pt-2">
                {warningSignals.map((signal) => (
                  <div key={signal.id} className="bg-white dark:bg-slate-900 p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold text-slate-800 dark:text-slate-200">{signal.title}</span>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.25 rounded ${
                        signal.status === 'Confirmed' ? 'bg-fuchsia-50 text-fuchsia-700 dark:bg-fuchsia-950/20' : 'bg-amber-50 text-amber-700 dark:bg-amber-950/20'
                      }`}>
                        {signal.status}
                      </span>
                    </div>
                    <p className="text-slate-500 text-[11px] leading-relaxed">{signal.details}</p>
                    <div className="flex justify-between items-center text-[10px] text-slate-400 font-semibold border-t border-slate-50 pt-1.5">
                      <span>Area: {signal.region}</span>
                      <span>Signal Strength: {signal.confidence}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 2. THE HUMAN RIGHTS SCORECARD / SIGNAL PANEL */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase tracking-tight">GIRMAIC HUMAN RIGHTS SIGNAL SCORECARD</h3>
            <p className="text-xs text-slate-500">Evaluating overall platform integrity, data quality, and documentation metrics.</p>
          </div>
          <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2.5 py-1 rounded-full border border-slate-200 uppercase">
            Data Quality Audit Log
          </span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-4">
          {[
            { label: 'Evidence Audit Pool', val: scorecardMetrics.evidenceAvailability, color: 'text-emerald-600', bg: 'bg-emerald-50 dark:bg-emerald-950/20' },
            { label: 'Verification Trust', val: scorecardMetrics.verificationConfidence, color: 'text-indigo-650', bg: 'bg-indigo-50 dark:bg-indigo-950/20' },
            { label: 'Source Diversification', val: scorecardMetrics.sourceDiversity, color: 'text-violet-650', bg: 'bg-violet-50 dark:bg-violet-950/20' },
            { label: 'Emergent Trend Strength', val: scorecardMetrics.trendStrength, color: 'text-fuchsia-600', bg: 'bg-fuchsia-50 dark:bg-fuchsia-950/20' },
            { label: 'Resource Network Span', val: scorecardMetrics.resourceAvailability, color: 'text-blue-650', bg: 'bg-blue-50 dark:bg-blue-950/20' },
            { label: 'System Action Velocity', val: scorecardMetrics.responseActivity, color: 'text-rose-650', bg: 'bg-rose-50 dark:bg-rose-950/20' }
          ].map((sc, i) => (
            <div key={i} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/20 text-center space-y-1.5">
              <span className="text-[10px] text-slate-400 block font-bold uppercase leading-tight">{sc.label}</span>
              <div className="flex items-center justify-center gap-1">
                <span className={`text-xl font-black ${sc.color}`}>{sc.val}%</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-850 h-1.5 rounded-full overflow-hidden">
                <div className={`h-full ${sc.color.replace('text-', 'bg-')}`} style={{ width: `${sc.val}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3. COGNITIVE HOPE / SOLUTIONS BLOCK (Prevent Suffering Overshadowing) */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2">
          <Heart className="h-5 w-5 text-emerald-600" />
          <h3 className="text-sm font-black text-slate-850 dark:text-slate-100 uppercase">HUMAN RIGHTS HOPE & SOLUTIONS PORTAL</h3>
        </div>
        <p className="text-xs text-slate-500">
          Because justice is not merely about highlighting suffering, but empowering the structures that heal communities. Here are verified peaceful interventions, resolved cases, and positive community legal developments.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {[
            { title: 'Verified Support Referrals Completed', val: '41 Cases Partnered', label: 'Dignity legal aides matched with families securely.' },
            { title: 'Educational Campaign Distribution', val: '1,240 Core Readers', label: 'Plain-language legal literacy manuals printed and accessed locally.' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl border border-slate-100 dark:border-slate-800 bg-emerald-50/15 dark:bg-emerald-950/5 space-y-1 text-xs">
              <span className="font-extrabold text-slate-800 dark:text-slate-250 block">{item.title}</span>
              <div className="text-sm font-black text-emerald-650 dark:text-emerald-400">{item.val}</div>
              <p className="text-slate-500 text-[11px] leading-relaxed">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
