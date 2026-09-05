/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { ShieldAlert, Fingerprint, Camera, ShieldCheck, HeartPulse, Info } from 'lucide-react';

export default function SafetyCenter() {
  const sections = [
    {
      id: 'personal',
      title: 'Personal Safety First',
      icon: <HeartPulse className="h-6 w-6 text-rose-500" />,
      desc: 'Protecting your life, physical security, and wellness is always the absolute priority. No documentation or evidence is worth compromising your immediate physical safety.',
      bullets: [
        'If you believe you are in immediate danger, evacuate to a secure public space or crossing immediately.',
        'Do not engage in physical confrontation with hostile forces, state authorities, or armed individuals.',
        'Keep trusted contacts updated with your live coordinates through secure, encrypted communication.'
      ]
    },
    {
      id: 'digital',
      title: 'Digital Footprint Safety',
      icon: <Fingerprint className="h-6 w-6 text-indigo-500" />,
      desc: 'Ensure your digital activity does not leave a trace that could expose your identity or location to adversaries.',
      bullets: [
        'Utilize a reputable, trusted Virtual Private Network (VPN) when uploading or browsing sensitive materials.',
        'Use standard private browsing/incognito tabs and clear cookies and history regularly.',
        'Implement strong, unique device-lock passcodes (avoid biometrics like FaceID which can be forced).'
      ]
    },
    {
      id: 'reporting',
      title: 'Secure Reporting Guidelines',
      icon: <ShieldCheck className="h-6 w-6 text-emerald-500" />,
      desc: 'How to submit reports on the platform or other networks without risking reprisal.',
      bullets: [
        'Select the CONFIDENTIAL or ANONYMOUS privacy tier on our reporting form if you face legal or social risks.',
        'Never state exact residential addresses or specific witness names unless absolutely necessary and securely restricted.',
        'Only write what you have personally witnessed or can back up with reliable secondary corroboration.'
      ]
    },
    {
      id: 'evidence',
      title: 'Safe Evidence Collection',
      icon: <Camera className="h-6 w-6 text-cyan-500" />,
      desc: 'How to preserve records and documents securely while minimizing identity leaks.',
      bullets: [
        'Be extremely careful capturing live footage in public places. Use discreet angles and keep backing up files immediately.',
        'Our platform automatically strips EXIF metadata (GPS coords, device IDs) upon submission to protect you.',
        'Keep sensitive screenshots and digital evidence in hidden, secure folder structures with isolated passkeys.'
      ]
    }
  ];

  return (
    <div className="space-y-6" id="safety-center">
      <div className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-850 rounded-2xl p-6">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
          <ShieldAlert className="h-5 w-5 text-rose-500 animate-bounce" />
          Safety Center & Security Protocols
        </h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Review these crucial guidelines before documenting, recording, or submitting any human rights concern. Your safety and human dignity are paramount.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {sections.map((sec) => (
          <div
            key={sec.id}
            id={`safety-sec-${sec.id}`}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div className="flex items-center gap-3 border-b border-slate-200/50 dark:border-slate-850 pb-3 mb-4">
              <div className="p-2 bg-slate-50 dark:bg-slate-850 rounded-xl">
                {sec.icon}
              </div>
              <h3 className="text-base font-bold text-slate-850 dark:text-slate-100">
                {sec.title}
              </h3>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed mb-4">
              {sec.desc}
            </p>

            <ul className="space-y-2.5">
              {sec.bullets.map((bullet, idx) => (
                <li key={idx} className="flex gap-2.5 text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  <span className="text-emerald-500 font-bold shrink-0">•</span>
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200/50 rounded-2xl p-5 flex gap-3">
        <Info className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <h4 className="text-xs font-bold text-amber-800 dark:text-amber-300">Official International Assistance Notice</h4>
          <p className="text-[11px] text-amber-700 dark:text-amber-400/80 leading-relaxed">
            If you are fleeing active conflict, seeking asylum, or facing persecution, connect immediately with the **United Nations High Commissioner for Refugees (UNHCR)** or secure local partner networks listed in our **Get Help** directory. This platform provides secure documentation and is not a direct law-enforcement dispatch cell.
          </p>
        </div>
      </div>
    </div>
  );
}
