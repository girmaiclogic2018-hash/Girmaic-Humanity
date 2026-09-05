/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useEffect } from 'react';
import { Globe, Eye, Type, Activity, ChevronDown } from 'lucide-react';

interface LanguageSelectorProps {
  currentLang: string;
  onChangeLang: (lang: string) => void;
  accessibility: {
    largeText: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
  };
  onToggleAccess: (key: 'largeText' | 'highContrast' | 'reducedMotion') => void;
}

export default function LanguageSelector({
  currentLang,
  onChangeLang,
  accessibility,
  onToggleAccess
}: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const languages = [
    { code: 'en', label: 'English', flag: '🇬🇧' },
    { code: 'am', label: 'አማርኛ (Amharic)', flag: '🇪🇹' },
    { code: 'om', label: 'Afaan Oromoo', flag: '🇪🇹' },
    { code: 'so', label: 'Soomaali (Somali)', flag: '🇸🇴' },
    { code: 'ar', label: 'العربية (Arabic)', flag: '🇸🇦' },
    { code: 'fr', label: 'Français (French)', flag: '🇫🇷' }
  ];

  const activeLang = languages.find(l => l.code === currentLang) || languages[0];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-2.5 shadow-sm" id="lang-selector">
      
      {/* Visual Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <button
          id="lang-dropdown-trigger"
          onClick={() => setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-label={`Select Application Language. Current active language is ${activeLang.label}`}
          className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold transition-all text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer"
        >
          <Globe className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
          <span className="text-base leading-none">{activeLang.flag}</span>
          <span>{activeLang.label}</span>
          <ChevronDown className={`h-3 w-3 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>

        {isOpen && (
          <ul
            role="listbox"
            aria-label="Application Language Options"
            className="absolute left-0 mt-1.5 w-56 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-850 shadow-lg rounded-xl overflow-hidden z-50 divide-y divide-slate-100 dark:divide-slate-800/60 animate-in fade-in duration-100"
          >
            {languages.map((lang) => (
              <li key={lang.code} role="option" aria-selected={currentLang === lang.code}>
                <button
                  id={`lang-opt-${lang.code}`}
                  onClick={() => {
                    onChangeLang(lang.code);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-4 py-2 text-xs font-bold text-left transition-colors cursor-pointer focus:outline-none ${
                    currentLang === lang.code
                      ? 'bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-lg leading-none shrink-0">{lang.flag}</span>
                    <span>{lang.label}</span>
                  </div>
                  {currentLang === lang.code && (
                    <span className="text-[10px] uppercase font-bold text-emerald-600 dark:text-emerald-400">Active</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="h-4 w-px bg-slate-200 dark:bg-slate-700 hidden sm:block"></div>

      <div className="flex items-center gap-1.5">
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 flex items-center gap-1">
          <Eye className="h-3.5 w-3.5 text-slate-400" /> Accessibility:
        </span>
        <div className="flex gap-1" role="group" aria-label="Accessibility settings panel toggle">
          <button
            id="accessibility-largetext"
            title="Large Text Toggle"
            onClick={() => onToggleAccess('largeText')}
            aria-label="Toggle larger legible display text"
            aria-pressed={accessibility.largeText}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              accessibility.largeText
                ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Type className="h-3.5 w-3.5" />
          </button>
          <button
            id="accessibility-highcontrast"
            title="High Contrast Toggle"
            onClick={() => onToggleAccess('highContrast')}
            aria-label="Toggle high contrast outlines"
            aria-pressed={accessibility.highContrast}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              accessibility.highContrast
                ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Eye className="h-3.5 w-3.5" />
          </button>
          <button
            id="accessibility-reducedmotion"
            title="Reduced Motion Toggle"
            onClick={() => onToggleAccess('reducedMotion')}
            aria-label="Toggle reduced animations for motor sensitive users"
            aria-pressed={accessibility.reducedMotion}
            className={`p-1.5 rounded-lg border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              accessibility.reducedMotion
                ? 'bg-emerald-100 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-300'
                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-100'
            }`}
          >
            <Activity className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
