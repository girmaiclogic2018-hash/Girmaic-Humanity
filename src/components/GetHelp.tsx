/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Search, MapPin, Globe, Mail, Phone, ExternalLink, ShieldAlert, Award } from 'lucide-react';
import { officialOrganizations } from '../data/organizations';
import { Organization } from '../types';

export default function GetHelp() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    'all',
    'Legal aid',
    'Human-rights organizations',
    'Humanitarian assistance',
    'Refugee assistance',
    'Child protection',
    'Journalist support'
  ];

  const filteredOrgs = officialOrganizations.filter(org => {
    const matchesSearch = org.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          org.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || org.categories.includes(selectedCategory);
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6" id="get-help-section">
      <div className="bg-emerald-50/50 dark:bg-emerald-950/10 border border-emerald-200/50 dark:border-emerald-900/30 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-2">
            <Award className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
            Verified Support Directory
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Browse through legitimate, internationally recognized human-rights, legal aid, and humanitarian partners.
          </p>
        </div>
        <div className="flex gap-2 text-rose-800 dark:text-rose-405 text-[10px] bg-rose-50 dark:bg-rose-950/20 p-3 rounded-lg border border-rose-200/50 max-w-sm">
          <ShieldAlert className="h-4 w-4 shrink-0" />
          <span>
            <strong>Emergency Notice:</strong> This directory contains official references. We never fabricate organizational contact numbers or services. For immediate safety crises, access local state safety cells.
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            type="text"
            id="orgs-search-input"
            placeholder="Search verified organizations..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100"
          />
        </div>

        <div className="flex flex-wrap gap-1.5 w-full md:w-auto">
          {categories.map(cat => (
            <button
              key={cat}
              id={`orgs-cat-${cat.replace(/\s+/g, '-').toLowerCase()}`}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-50'
              }`}
            >
              {cat === 'all' ? 'All Resources' : cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredOrgs.map(org => (
          <div
            key={org.id}
            id={`org-card-${org.id}`}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
          >
            <div>
              <div className="flex justify-between items-start border-b border-slate-200/50 dark:border-slate-800/50 pb-3 mb-4">
                <div className="flex flex-wrap gap-1">
                  {org.categories.map(cat => (
                    <span key={cat} className="text-[10px] font-bold text-slate-500 dark:text-slate-450 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
                      {cat}
                    </span>
                  ))}
                </div>
                <span className="px-2 py-0.5 text-[9px] font-bold uppercase rounded bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-400 border border-emerald-200">
                  {org.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-1.5">
                {org.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                {org.description}
              </p>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-305">
                <MapPin className="h-3.5 w-3.5 text-slate-400" />
                <span>{org.location}</span>
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-1">
                {org.contactEmail && (
                  <a href={`mailto:${org.contactEmail}`} className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline">
                    <Mail className="h-3.5 w-3.5" /> Email support
                  </a>
                )}
                {org.website && (
                  <a href={org.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 hover:underline font-semibold">
                    <Globe className="h-3.5 w-3.5" /> Website <ExternalLink className="h-2.5 w-2.5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
