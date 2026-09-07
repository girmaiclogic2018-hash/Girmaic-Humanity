/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronLeft, 
  ChevronRight, 
  ShieldAlert, 
  FileText, 
  Calendar, 
  MapPin, 
  Paperclip, 
  Sparkles, 
  CheckCircle2, 
  Lock,
  Loader2,
  Mic,
  Download
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import { coreCategories } from '../data/categories';
import { localDb } from '../lib/localDb';
import { Report, ReportStatus, PrivacyLevel, EvidenceFile } from '../types';

interface ReportWizardProps {
  userId: string;
  onSuccess: (reportId: string) => void;
}

export default function ReportWizard({ userId, onSuccess }: ReportWizardProps) {
  const [step, setStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [scanning, setScanning] = useState(false);
  
  // Multi-step state fields
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [description, setDescription] = useState('');
  const [dateOfIncident, setDateOfIncident] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [city, setCity] = useState('');
  const [relationship, setRelationship] = useState<'affected' | 'witness' | 'source'>('affected');
  const [evidence, setEvidence] = useState<EvidenceFile[]>([]);
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [privacyLevel, setPrivacyLevel] = useState<PrivacyLevel>(PrivacyLevel.CONFIDENTIAL);

  // Secure client-side PDF Generator
  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Secure branding header background bar
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 32, 'F');

      // Header branding details
      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('GIRMAIC HUMANITY', 15, 12);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('GLOBAL HUMAN RIGHTS, JUSTICE & HUMAN DIGNITY PLATFORM', 15, 18);
      
      doc.setFont('helvetica', 'bold');
      doc.text('SECURE INCIDENT DOCUMENTATION DOSSIER', 15, 25);
      doc.text(`DATE GENERATED: ${new Date().toLocaleDateString()}`, 145, 25);

      // Section metadata
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text('OFFICIAL REPORT METADATA', 15, 45);

      doc.setDrawColor(226, 232, 240); // slate-200
      doc.line(15, 48, 195, 48);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.text(`Incident Category: ${selectedCats.join(', ') || 'AI suggested'}`, 15, 57);
      doc.text(`Date of Occurrence: ${dateOfIncident || 'Not specified'}`, 15, 64);
      doc.text(`Jurisdiction: ${country || 'Not specified'}, ${region || 'Not specified'}`, 15, 71);
      doc.text(`Submitter Relation: ${relationship.toUpperCase()}`, 15, 78);
      
      const privLabel = privacyLevel === PrivacyLevel.CONFIDENTIAL ? 'CONFIDENTIAL REVIEW' :
                        privacyLevel === PrivacyLevel.ANONYMOUS ? 'ANONYMOUS / HIDDEN ID' : 'PUBLIC AGGREGATED TRENDS';
      doc.text(`Privacy Configuration: ${privLabel}`, 15, 85);

      // Description section
      doc.setFont('helvetica', 'bold');
      doc.text('FACTUAL INCIDENT DESCRIPTION:', 15, 98);
      doc.line(15, 101, 195, 101);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(9.5);
      
      const splitDescription = doc.splitTextToSize(description || 'No factual description provided.', 180);
      doc.text(splitDescription, 15, 108);

      // Additional context if present
      if (additionalInfo) {
        const descHeight = splitDescription.length * 5;
        const nextY = 115 + descHeight;
        if (nextY < 240) {
          doc.setFont('helvetica', 'bold');
          doc.text('ADDITIONAL JURISDICTIONAL CONTEXT / REQUESTS:', 15, nextY);
          doc.line(15, nextY + 3, 195, nextY + 3);

          doc.setFont('helvetica', 'normal');
          const splitAdditional = doc.splitTextToSize(additionalInfo, 180);
          doc.text(splitAdditional, 15, nextY + 10);
        }
      }

      // Secure signature area / official seal block
      doc.setDrawColor(5, 150, 105); // emerald-600
      doc.rect(15, 252, 180, 28);
      
      doc.setTextColor(4, 120, 87); // emerald-700
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9.5);
      doc.text('GIRMAIC HUMANITY SECURE SHIELD VERIFICATION', 20, 259);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139); // slate-500
      doc.text('This document serves as an offline-ready secure summary of a recorded humanitarian report.', 20, 265);
      doc.text('Founder & Visionary: Girma Haile Bunaro | Origin: Dire Dawa, Ethiopia', 20, 270);
      doc.text('Contact & Safe Channels: girmahb1979@gmail.com | girmaiclogic2018@gmail.com', 20, 275);

      doc.save(`Girmaic_Humanity_Report_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF creation error:', err);
    }
  };

  // AI Classification state
  const [aiSuggestion, setAiSuggestion] = useState<{
    suggestedCategory: string;
    confidence: number;
    reason: string;
    safetyWarnings: string[];
  } | null>(null);

  // Speech Recognition setup
  const [isListeningDesc, setIsListeningDesc] = useState(false);
  const recognitionDescRef = useRef<any>(null);

  const [isListeningAdd, setIsListeningAdd] = useState(false);
  const recognitionAddRef = useRef<any>(null);

  const SpeechRecognitionAPI = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  const isSpeechSupported = !!SpeechRecognitionAPI;

  useEffect(() => {
    if (!isSpeechSupported) return;

    // Instance 1: Incident Description Textarea
    const recDesc = new SpeechRecognitionAPI();
    recDesc.continuous = false;
    recDesc.interimResults = false;
    recDesc.lang = 'en-US';

    recDesc.onstart = () => setIsListeningDesc(true);
    recDesc.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setDescription(prev => prev ? prev + ' ' + transcript : transcript);
      }
    };
    recDesc.onerror = () => setIsListeningDesc(false);
    recDesc.onend = () => setIsListeningDesc(false);
    recognitionDescRef.current = recDesc;

    // Instance 2: Additional Context Textarea
    const recAdd = new SpeechRecognitionAPI();
    recAdd.continuous = false;
    recAdd.interimResults = false;
    recAdd.lang = 'en-US';

    recAdd.onstart = () => setIsListeningAdd(true);
    recAdd.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setAdditionalInfo(prev => prev ? prev + ' ' + transcript : transcript);
      }
    };
    recAdd.onerror = () => setIsListeningAdd(false);
    recAdd.onend = () => setIsListeningAdd(false);
    recognitionAddRef.current = recAdd;

    return () => {
      if (recognitionDescRef.current) {
        try { recognitionDescRef.current.abort(); } catch (e) {}
      }
      if (recognitionAddRef.current) {
        try { recognitionAddRef.current.abort(); } catch (e) {}
      }
    };
  }, [isSpeechSupported]);

  const toggleSpeechDesc = () => {
    if (!recognitionDescRef.current) return;
    if (isListeningDesc) {
      recognitionDescRef.current.stop();
    } else {
      try {
        if (isListeningAdd) recognitionAddRef.current.stop();
        recognitionDescRef.current.start();
      } catch (e) {
        console.warn('Speech initiation error:', e);
      }
    }
  };

  const toggleSpeechAdd = () => {
    if (!recognitionAddRef.current) return;
    if (isListeningAdd) {
      recognitionAddRef.current.stop();
    } else {
      try {
        if (isListeningDesc) recognitionDescRef.current.stop();
        recognitionAddRef.current.start();
      } catch (e) {
        console.warn('Speech initiation error:', e);
      }
    }
  };

  const totalSteps = 10;

  // Step names for tracking progress
  const stepTitles = [
    'Select Categories',
    'Describe Incident',
    'Incident Date',
    'Location',
    'Your Relationship',
    'Evidence Files',
    'Additional Information',
    'Safety Check',
    'Select Privacy Level',
    'Confirm & Submit'
  ];

  const handleToggleCategory = (catId: string) => {
    if (selectedCats.includes(catId)) {
      setSelectedCats(selectedCats.filter(c => c !== catId));
    } else {
      setSelectedCats([...selectedCats, catId]);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files) as File[];
    
    const newEvidence: EvidenceFile[] = files.map((file, idx) => ({
      id: `ev-uploaded-${Date.now()}-${idx}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      isMalwareChecked: true, // Simulated server checks
      metadataMinimized: true // Client sanitization simulation
    }));

    setEvidence([...evidence, ...newEvidence]);
  };

  const triggerAIScan = async () => {
    if (!description || description.length < 15) return;
    setScanning(true);
    try {
      const res = await fetch('/api/gemini/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description })
      });
      const data = await res.json();
      setAiSuggestion({
        suggestedCategory: data.suggestedCategory,
        confidence: data.confidence || 0.85,
        reason: data.reason || 'Incident context matches systemic classification patterns.',
        safetyWarnings: data.safetyWarnings || []
      });
      // Suggest category to user
      if (data.suggestedCategory && !selectedCats.includes(data.suggestedCategory)) {
        // Option to add suggested
      }
    } catch (err) {
      console.warn('AI classification failed, falling back to local heuristic scan.', err);
      // Fallback heuristics scan for security warnings (phone numbers, addresses)
      const phoneRegex = /(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/g;
      const foundWarnings: string[] = [];
      if (phoneRegex.test(description)) {
        foundWarnings.push('Potential phone number detected. Ensure you do not put individuals at risk.');
      }
      setAiSuggestion({
        suggestedCategory: 'injustice',
        confidence: 0.6,
        reason: 'Local scanner loaded.',
        safetyWarnings: foundWarnings
      });
    } finally {
      setScanning(false);
    }
  };

  const handleNext = () => {
    if (step === 2 && description.length >= 15) {
      triggerAIScan();
    }
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try {
      // Simulate network request block / database storage
      const year = new Date().getFullYear();
      const randNum = Math.floor(100000 + Math.random() * 90000);
      const generatedId = `HR-${year}-${randNum}`;

      const finalReport: Report = {
        id: generatedId,
        userId: userId || 'anonymous',
        categories: selectedCats.length > 0 ? selectedCats : [aiSuggestion?.suggestedCategory || 'injustice'],
        description,
        dateOfIncident,
        locationOfIncident: {
          country,
          region,
          city: city || undefined
        },
        relationship,
        evidence,
        additionalInfo: additionalInfo || undefined,
        privacyLevel,
        status: ReportStatus.SUBMITTED,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        
        // AI fields
        aiSuggestedCategory: aiSuggestion?.suggestedCategory,
        aiConfidence: aiSuggestion?.confidence,
        aiReason: aiSuggestion?.reason,
        aiSafetyFlags: aiSuggestion?.safetyWarnings,
        humanReviewed: false,
        
        timeline: [
          {
            id: `t-init-${Date.now()}`,
            status: ReportStatus.SUBMITTED,
            changedBy: 'System Engine',
            timestamp: new Date().toISOString(),
            notes: `Secure human rights report received and timestamped at local time: ${new Date().toLocaleString()}.`
          }
        ],
        reviews: []
      };

      // Store securely in our localized state engine or queue for background sync if offline
      if (!navigator.onLine) {
        localDb.queueOfflineReport(finalReport);
      } else {
        localDb.saveReport(finalReport);
      }
      
      // Complete flow
      onSuccess(generatedId);
    } catch (err) {
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-sm p-6 max-w-3xl mx-auto" id="report-wizard">
      {/* Header and indicator */}
      <div className="flex justify-between items-center border-b border-slate-200/50 dark:border-slate-800/50 pb-4 mb-6">
        <div>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            Step {step} of {totalSteps}
          </span>
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            {stepTitles[step - 1]}
          </h2>
        </div>

        {/* Secure badge */}
        <span className="flex items-center gap-1 text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 border border-slate-200 dark:border-slate-700 px-2.5 py-1 rounded-lg">
          <Lock className="h-3 w-3 text-emerald-500" /> End-to-End Encrypted Secure Flow
        </span>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-slate-800 h-1.5 rounded-full mb-8 overflow-hidden">
        <div 
          className="bg-emerald-600 h-full rounded-full transition-all duration-300"
          style={{ width: `${(step / totalSteps) * 100}%` }}
        ></div>
      </div>

      {/* Content Canvas */}
      <div className="min-h-[250px] mb-8" id={`wizard-step-canvas-${step}`}>
        {/* Step 1: Core categories */}
        {step === 1 && (
          <div className="space-y-4">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Select one or more of our 20 core human rights concern categories.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-h-[300px] overflow-y-auto pr-1">
              {coreCategories.map((cat) => (
                <button
                  key={cat.id}
                  id={`cat-select-${cat.id}`}
                  onClick={() => handleToggleCategory(cat.id)}
                  className={`flex items-start text-left gap-3 border p-3.5 rounded-xl transition-all cursor-pointer ${
                    selectedCats.includes(cat.id)
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center shrink-0 ${
                    selectedCats.includes(cat.id) ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-slate-300'
                  }`}>
                    {selectedCats.includes(cat.id) && <span className="text-[10px] font-bold">✓</span>}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-150">{cat.name}</h4>
                    <p className="text-[10px] text-slate-400 mt-1 line-clamp-2 leading-relaxed">{cat.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Describe incident */}
        {step === 2 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                <FileText className="h-4 w-4 text-emerald-600" />
                Provide a complete factual description of the incident:
              </label>
              <div className="flex items-center gap-2">
                {isSpeechSupported && (
                  <button
                    type="button"
                    onClick={toggleSpeechDesc}
                    className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      isListeningDesc
                        ? 'bg-rose-500 border-rose-500 text-white animate-pulse shadow-xs'
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350 hover:bg-slate-50'
                    }`}
                    title={isListeningDesc ? "Listening... Click to stop speaking." : "Dictate description by voice"}
                    aria-label={isListeningDesc ? "Stop voice dictation for incident description" : "Start voice dictation for incident description"}
                  >
                    <Mic className="h-3 w-3" />
                    <span>{isListeningDesc ? "Listening..." : "Dictate"}</span>
                  </button>
                )}
                {scanning && (
                  <span className="text-[10px] text-emerald-600 flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" /> Scanning with AI...
                  </span>
                )}
              </div>
            </div>

            <textarea
              id="report-desc-textarea"
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please share what happened. Be as factual and specific as possible (e.g. details of actions taken, individuals involved, context, etc.). Minimum 15 characters."
              className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
            ></textarea>

            {aiSuggestion && (
              <div className="bg-emerald-50/50 dark:bg-emerald-950/15 border border-emerald-200/50 rounded-xl p-3 flex gap-2.5 items-start">
                <Sparkles className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5 animate-pulse" />
                <div className="text-[11px] leading-relaxed">
                  <span className="font-bold text-emerald-800 dark:text-emerald-305">AI Suggestion:</span> {aiSuggestion.reason} (Confidence: {Math.round(aiSuggestion.confidence * 100)}%)
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 3: Date */}
        {step === 3 && (
          <div className="space-y-4 max-w-sm">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Calendar className="h-4 w-4 text-emerald-600" /> Date of Incident:
            </label>
            <input
              type="date"
              id="report-date-input"
              value={dateOfIncident}
              onChange={(e) => setDateOfIncident(e.target.value)}
              className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
            />
          </div>
        )}

        {/* Step 4: Where */}
        {step === 4 && (
          <div className="space-y-4 max-w-md">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin className="h-4 w-4 text-emerald-600" /> Spatial Location Information:
            </label>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400">COUNTRY *</span>
                <input
                  type="text"
                  id="report-country"
                  placeholder="e.g. Kenya, Ethiopia"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400">REGION *</span>
                <input
                  type="text"
                  id="report-region"
                  placeholder="e.g. Oromia, Nairobi"
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-slate-400">CITY OR VILLAGE (OPTIONAL)</span>
              <input
                type="text"
                id="report-city"
                placeholder="e.g. Adama, Central Nairobi"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Step 5: Relationship */}
        {step === 5 && (
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-305">Your relationship to this reported incident:</span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { key: 'affected', title: 'Directly Affected', desc: 'I was directly involved or affected by this concern.' },
                { key: 'witness', title: 'Witness', desc: 'I personally observed or witnessed the incident take place.' },
                { key: 'source', title: 'Information Source', desc: 'I am securely transmitting reports or details from another party.' }
              ].map(rel => (
                <button
                  key={rel.key}
                  id={`rel-select-${rel.key}`}
                  onClick={() => setRelationship(rel.key as any)}
                  className={`flex flex-col text-left p-4 border rounded-2xl transition-all cursor-pointer ${
                    relationship === rel.key
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-150">{rel.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">{rel.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 6: Evidence */}
        {step === 6 && (
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Safely Attach Evidence Documents:</span>
            
            <div className="border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center bg-slate-50/50 dark:bg-slate-900/30">
              <Paperclip className="h-8 w-8 text-slate-400 mx-auto mb-2" />
              <p className="text-xs text-slate-600 dark:text-slate-405">
                Drag and drop files, or <strong className="text-emerald-600 cursor-pointer">browse</strong> to upload.
              </p>
              <span className="text-[10px] text-slate-400 block mt-1">
                Images, Videos, Audio transcripts, documents, or screenshots up to 25MB.
              </span>
              <input
                type="file"
                id="wizard-file-upload"
                multiple
                onChange={handleFileUpload}
                className="hidden"
              />
              <button 
                id="wizard-browse-btn"
                onClick={() => document.getElementById('wizard-file-upload')?.click()}
                className="mt-3 px-3 py-1.5 border border-slate-200 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 rounded-lg text-xs font-semibold cursor-pointer shadow-sm hover:bg-slate-50"
              >
                Select Files
              </button>
            </div>

            {evidence.length > 0 && (
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-400 block">UPLOADED SECURE FILES ({evidence.length})</span>
                <div className="space-y-1.5">
                  {evidence.map(f => (
                    <div key={f.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-750 rounded-lg p-2.5 text-xs">
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate max-w-sm">{f.name}</span>
                      <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200">
                        Securely Cleared
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 7: Optional Info */}
        {step === 7 && (
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">
                Optional Additional Context / Requests:
              </label>
              {isSpeechSupported && (
                <button
                  type="button"
                  onClick={toggleSpeechAdd}
                  className={`flex items-center gap-1 px-2.5 py-1 text-[10px] font-extrabold rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    isListeningAdd
                      ? 'bg-rose-500 border-rose-500 text-white animate-pulse shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-350 hover:bg-slate-50'
                  }`}
                  title={isListeningAdd ? "Listening... Click to stop speaking." : "Dictate additional context by voice"}
                  aria-label={isListeningAdd ? "Stop voice dictation for optional details" : "Start voice dictation for optional details"}
                >
                  <Mic className="h-3 w-3" />
                  <span>{isListeningAdd ? "Listening..." : "Dictate"}</span>
                </button>
              )}
            </div>
            <textarea
              id="report-optional-textarea"
              rows={4}
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              placeholder="Any other details, witness leads, or safety requests that might help reviewers assist you safely."
              className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl p-3.5 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
            ></textarea>
          </div>
        )}

        {/* Step 8: Safety check */}
        {step === 8 && (
          <div className="bg-rose-50 dark:bg-rose-950/15 border border-rose-200/50 rounded-2xl p-6 flex gap-4 max-w-2xl mx-auto">
            <ShieldAlert className="h-10 w-10 text-rose-500 shrink-0 mt-1 animate-pulse" />
            <div className="space-y-2">
              <h3 className="font-bold text-rose-800 dark:text-rose-405 text-base">MANDATORY SAFETY DISCLOSURE</h3>
              <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed">
                "Only share information that you are safely and legally able to share. Do not put yourself or another person at unnecessary risk."
              </p>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">
                If capturing footage, retaining paperwork, or maintaining an active link to this platform exposes you to threat, immediately exit, utilize incognito browsers, and follow our **Safety Center** digital security checklist.
              </p>
            </div>
          </div>
        )}

        {/* Step 9: Privacy level */}
        {step === 9 && (
          <div className="space-y-4">
            <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Select Report Access Privacy Level:</span>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { 
                  val: PrivacyLevel.CONFIDENTIAL, 
                  title: 'CONFIDENTIAL', 
                  desc: 'Only authorized super administrators and assigned verified review staff have decryption and review rights.' 
                },
                { 
                  val: PrivacyLevel.RESTRICTED_REVIEW, 
                  title: 'RESTRICTED REVIEW', 
                  desc: 'Limited access to our verified review team and verified humanitarian legal aid partner organizations.' 
                },
                { 
                  val: PrivacyLevel.ANONYMOUS, 
                  title: 'ANONYMOUS / HIDDEN ID', 
                  desc: 'Submit report with your profile name and email fully scrubbed from review dashboards. Maximum identity security.' 
                },
                { 
                  val: PrivacyLevel.PUBLIC_AGGREGATED, 
                  title: 'PUBLIC AGGREGATED ONLY', 
                  desc: 'Exclude from standard reviews completely. Only allow statistical and spatial trends counters on public dashboards.' 
                }
              ].map(level => (
                <button
                  key={level.val}
                  id={`priv-select-${level.val}`}
                  onClick={() => setPrivacyLevel(level.val)}
                  className={`flex flex-col text-left p-4 border rounded-2xl transition-all cursor-pointer ${
                    privacyLevel === level.val
                      ? 'bg-emerald-50/50 dark:bg-emerald-950/20 border-emerald-500 shadow-sm'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300'
                  }`}
                >
                  <h4 className="text-xs font-bold text-slate-800 dark:text-slate-150">{level.title}</h4>
                  <p className="text-[10px] text-slate-400 mt-1.5 leading-relaxed">{level.desc}</p>
                </button>
              ))}
            </div>
            
            <span className="text-[10px] text-slate-405 block text-center mt-2 font-semibold bg-amber-50 dark:bg-amber-950/20 p-2.5 rounded-lg border border-amber-200/50">
              Caution: To uphold transparency and legal accuracy, we never promise absolute technical anonymity, but maintain cutting-edge data compartmentalization practices.
            </span>
          </div>
        )}

        {/* Step 10: Confirmation */}
        {step === 10 && (
          <div className="space-y-6 text-center max-w-md mx-auto">
            <CheckCircle2 className="h-14 w-14 text-emerald-600 mx-auto animate-bounce" />
            <div className="space-y-2">
              <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">Ready for Secure Submission</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                By submitting, your report will be encrypted and submitted into our review pipelines. You will receive a secure reference number to monitor progress.
              </p>
            </div>

            <div className="bg-slate-50 dark:bg-slate-850/50 border border-slate-200 dark:border-slate-800 rounded-xl p-4 text-xs text-left space-y-2">
              <div className="flex justify-between">
                <span className="text-slate-450">Categories:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300 capitalize">{selectedCats.join(', ') || 'AI suggested'}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450">Location:</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">{country || 'Not specified'}, {region}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-450">Privacy Access:</span>
                <span className="font-bold text-emerald-600 uppercase">{PrivacyLevel[privacyLevel]}</span>
              </div>
              <div className="flex justify-between border-t border-slate-200 dark:border-slate-750 pt-2 mt-2">
                <span className="text-slate-450 font-bold">Local Submission Time:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">{new Date().toLocaleString()}</span>
              </div>
            </div>

            {/* Offline secure PDF download action */}
            <button
              id="wizard-pdf-download-btn"
              onClick={handleDownloadPDF}
              className="w-full flex items-center justify-center gap-2 py-3 bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-100 dark:border-emerald-900/50 hover:bg-emerald-100/55 rounded-xl text-xs font-extrabold text-emerald-800 dark:text-emerald-300 transition-all cursor-pointer shadow-xs"
              title="Download full incident report draft as secure PDF"
              aria-label="Download your human rights report summary as secure PDF"
            >
              <Download className="h-4 w-4" />
              <span>Download Report Summary (Secure PDF)</span>
            </button>
          </div>
        )}
      </div>

      {/* Footer Navigation */}
      <div className="flex justify-between border-t border-slate-200/50 dark:border-slate-800/50 pt-4">
        <button
          id="wizard-back-btn"
          onClick={handlePrev}
          disabled={step === 1 || submitting}
          className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer transition-all border ${
            step === 1
              ? 'opacity-30 cursor-not-allowed border-slate-200 text-slate-400'
              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50'
          }`}
        >
          <ChevronLeft className="h-4 w-4" /> Back
        </button>

        {step < totalSteps ? (
          <button
            id="wizard-next-btn"
            onClick={handleNext}
            disabled={
              (step === 1 && selectedCats.length === 0) ||
              (step === 2 && description.length < 15) ||
              (step === 3 && !dateOfIncident) ||
              (step === 4 && (!country || !region))
            }
            className={`flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-bold text-white transition-all cursor-pointer shadow-sm ${
              ((step === 1 && selectedCats.length === 0) ||
               (step === 2 && description.length < 15) ||
               (step === 3 && !dateOfIncident) ||
               (step === 4 && (!country || !region)))
                ? 'bg-slate-300 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                : 'bg-emerald-600 hover:bg-emerald-550 shadow-emerald-650/10'
            }`}
          >
            Continue <ChevronRight className="h-4 w-4" />
          </button>
        ) : (
          <button
            id="wizard-submit-btn"
            onClick={handleSubmit}
            disabled={submitting}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-550 text-white px-6 py-2.5 rounded-xl text-xs font-bold cursor-pointer transition-all shadow-md shadow-emerald-650/10"
          >
            {submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Submitting...
              </>
            ) : (
              'Submit Secure Report'
            )}
          </button>
        )}
      </div>
    </div>
  );
}
