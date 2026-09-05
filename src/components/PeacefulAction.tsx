/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Leaf, FileText, Share2, Users, Flame, Heart, Copy, Check, MessageSquare } from 'lucide-react';

interface Petition {
  id: string;
  title: string;
  description: string;
  target: string;
  signatures: number;
  signed: boolean;
}

interface LetterTemplate {
  id: string;
  title: string;
  recipient: string;
  subject: string;
  body: string;
}

export default function PeacefulAction() {
  const [copiedLetterId, setCopiedLetterId] = useState<string | null>(null);
  const [petitions, setPetitions] = useState<Petition[]>([
    {
      id: 'pet-1',
      title: 'Call for Comprehensive Anti-Discrimination Laws in Housing',
      description: 'Urging regional legislatures to enact robust, transparent legal protections ensuring equal access to housing for all citizens without ethnic, gender, or religious profiling.',
      target: 'Regional Legislative Assembly',
      signatures: 1420,
      signed: false
    },
    {
      id: 'pet-2',
      title: 'Mandate Police Accountability and Independent Human-Rights Oversight',
      description: 'Enforcing the establishment of fully independent, civilian-led investigative committees to review and prosecute all alleged incidents of law enforcement misconduct or excessive force.',
      target: 'Ministry of Federal Security and Justice',
      signatures: 2850,
      signed: false
    }
  ]);

  const letterTemplates: LetterTemplate[] = [
    {
      id: 'let-1',
      title: 'Letter to Local Ombudsman Regarding Prisoner Pre-Trial Delays',
      recipient: 'Your Local Ombudsman Office / Judicial Council',
      subject: 'Urgent Request for Fair Trial Standards and Case Reviews',
      body: `Dear Honorable Ombudsman,\n\nI am writing to draw your urgent attention to the prolonged pre-trial detention periods experienced by individuals awaiting judicial review in our region.\n\nUnder international human-rights covenants, specifically Article 9 of the ICCPR, everyone has the right to liberty and a fair, speedy trial. Holding detainees indefinitely without presentation before an independent magistrate undermines the rule of law and human dignity.\n\nI respectfully request that your office audit the local detention centers and facilitate immediate reviews to guarantee due process for all citizens.\n\nSincerely,\n[Your Name]\n[A Concerned Advocate for Human Dignity]`
    },
    {
      id: 'let-2',
      title: 'Inquiry into Fair Access to Regional Public Resources',
      recipient: 'Regional Town Council / District Commissioner',
      subject: 'Ensuring Inclusive and Non-Discriminatory Resource Allocation',
      body: `Dear Council Members,\n\nI am writing to respectfully inquire about the administrative mechanisms in place to guarantee that public investments, clean water pipelines, and educational assets are distributed equitably across all neighborhoods without systemic bias or exclusion.\n\nInclusive development is a fundamental aspect of human-rights and social justice. When certain communities face marginalization from civic spaces, it limits their safety and human dignity.\n\nI look forward to hearing about your current strategies to ensure all neighborhood residents are welcomed into the decision-making dialogue.\n\nSincerely,\n[Your Name]\n[A Resident Dedicated to Community Equality]`
    }
  ];

  const handleSignPetition = (id: string) => {
    setPetitions(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          signatures: p.signed ? p.signatures - 1 : p.signatures + 1,
          signed: !p.signed
        };
      }
      return p;
    }));
  };

  const handleCopyLetter = (id: string, text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopiedLetterId(id);
      setTimeout(() => setCopiedLetterId(null), 2000);
    });
  };

  return (
    <div className="space-y-6" id="peaceful-action-board">
      <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/50 dark:border-emerald-900/30 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
          <Leaf className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          Peaceful & Lawful Civic Advocacy
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-405 mt-1">
          "We do not fight people. We fight injustice." Explore completely peaceful, legal, and educational pathways to support human rights, raise awareness, and connect with fellow community advocates.
        </p>

        {/* Prohibited actions banner */}
        <div className="mt-4 p-3.5 bg-rose-50 dark:bg-rose-950/15 border border-rose-100 rounded-xl flex items-center gap-2.5">
          <Heart className="h-4 w-4 text-rose-500 shrink-0" />
          <p className="text-[10px] text-rose-800 dark:text-rose-400 leading-relaxed font-semibold">
            Strict Code of Conduct: Any form of targeted harassment, doxxing, violent incitement, revenge rhetoric, or extremist political alignment is strictly prohibited and subject to immediate account suspension.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Interactive Petitions Section */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-205 pb-2">
            <Users className="h-4.5 w-4.5 text-emerald-600" /> Peaceful Advocacy Petitions
          </h3>

          <div className="space-y-4">
            {petitions.map(pet => (
              <div
                key={pet.id}
                id={`petition-${pet.id}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex justify-between items-start gap-4">
                  <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                    {pet.title}
                  </h4>
                  <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200">
                    Active
                  </span>
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {pet.description}
                </p>

                <div className="mt-4 pt-3.5 border-t border-slate-200/50 dark:border-slate-805 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="text-xs">
                    <span className="text-slate-400 uppercase font-semibold text-[10px] block">Signatures Gathered</span>
                    <span className="font-bold text-slate-700 dark:text-slate-300">{pet.signatures} advocates signed</span>
                  </div>

                  <button
                    id={`petition-btn-${pet.id}`}
                    onClick={() => handleSignPetition(pet.id)}
                    className={`px-4 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer border ${
                      pet.signed
                        ? 'bg-emerald-50 dark:bg-emerald-950/25 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                        : 'bg-emerald-600 text-white border-emerald-600 shadow-sm hover:bg-emerald-550'
                    }`}
                  >
                    {pet.signed ? 'Withdraw Signature' : 'Sign Petition'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Advocacy Letter Templates Section */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-205 pb-2">
            <FileText className="h-4.5 w-4.5 text-emerald-600" /> Lawful Letter Templates
          </h3>

          <div className="space-y-4">
            {letterTemplates.map(letT => (
              <div
                key={letT.id}
                id={`letter-${letT.id}`}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm"
              >
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                      {letT.title}
                    </h4>
                    <span className="text-[10px] text-slate-400 mt-1 block font-medium">
                      Recipient: <strong className="text-slate-600 dark:text-slate-300">{letT.recipient}</strong>
                    </span>
                  </div>
                  <button
                    id={`letter-copy-${letT.id}`}
                    onClick={() => handleCopyLetter(letT.id, `${letT.subject}\n\n${letT.body}`)}
                    className="p-1.5 border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-emerald-600 dark:hover:text-emerald-400 rounded-lg bg-slate-50 dark:bg-slate-800 cursor-pointer transition-colors"
                    title="Copy to Clipboard"
                  >
                    {copiedLetterId === letT.id ? <Check className="h-4 w-4 text-emerald-600" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>

                <div className="mt-3.5 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800 rounded-xl p-3 max-h-[140px] overflow-y-auto">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Subject: {letT.subject}</span>
                  <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-2 whitespace-pre-wrap leading-relaxed">
                    {letT.body}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
