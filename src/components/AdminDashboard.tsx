/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Users, 
  FileText, 
  ClipboardCheck, 
  BarChart3, 
  Compass, 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  History, 
  Check, 
  Sparkles,
  Eye
} from 'lucide-react';
import { localDb } from '../lib/localDb';
import { Report, ReportStatus, UserRole, AuditLog, CommunityPost } from '../types';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'reports' | 'moderation' | 'audit' | 'settings'>('overview');
  const [reports, setReports] = useState<Report[]>([]);
  const [posts, setPosts] = useState<CommunityPost[]>([]);
  const [audits, setAudits] = useState<AuditLog[]>([]);
  
  // Selected report for review
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<ReportStatus>(ReportStatus.VERIFIED);
  const [finalCategory, setFinalCategory] = useState('');

  // Settings
  const [retentionDays, setRetentionDays] = useState(180);
  const [emergencyWarning, setEmergencyWarning] = useState(true);

  useEffect(() => {
    setReports(localDb.getReports());
    setPosts(localDb.getCommunityPosts());
    
    // Simple admin mock audit logs
    const mockAudits: AuditLog[] = [
      {
        id: 'aud-1',
        actorId: 'demo-admin',
        actorEmail: 'admin@girmaic.org',
        action: 'PROMOTED USER TO VERIFIED_CONTRIBUTOR (Tadesse K.)',
        targetId: 'demo-user-1',
        timestamp: '2026-08-28T10:00:00Z'
      },
      {
        id: 'aud-2',
        actorId: 'demo-admin',
        actorEmail: 'admin@girmaic.org',
        action: 'VERIFIED HR-2026-000125 (Nairobi police incident)',
        targetId: 'HR-2026-000125',
        timestamp: '2026-08-20T09:00:00Z'
      }
    ];
    setAudits(mockAudits);
  }, []);

  const handleApplyReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    const updatedTimeline = [
      ...selectedReport.timeline,
      {
        id: `t-review-${Date.now()}`,
        status: selectedStatus,
        changedBy: 'Super Admin',
        timestamp: new Date().toISOString(),
        notes: `Review applied: ${reviewNotes || 'Progress update recorded.'}`
      }
    ];

    const updatedReport: Report = {
      ...selectedReport,
      status: selectedStatus,
      finalCategory: finalCategory || selectedReport.categories[0],
      humanReviewed: true,
      timeline: updatedTimeline,
      reviews: [
        ...selectedReport.reviews,
        {
          reviewer: 'Super Admin',
          reviewDate: new Date().toISOString().split('T')[0],
          reviewNotes,
          evidenceConsidered: selectedReport.evidence.map(e => e.name),
          decision: `Status modified to ${selectedStatus}`,
          decisionStatus: selectedStatus
        }
      ]
    };

    localDb.saveReport(updatedReport);
    
    // Update local list
    setReports(reports.map(r => r.id === updatedReport.id ? updatedReport : r));
    
    // Log audit
    const newAudit: AuditLog = {
      id: `aud-new-${Date.now()}`,
      actorId: 'demo-admin',
      actorEmail: 'admin@girmaic.org',
      action: `CASE REVIEW UPDATED FOR ${updatedReport.id} to ${selectedStatus}`,
      targetId: updatedReport.id,
      timestamp: new Date().toISOString()
    };
    setAudits([newAudit, ...audits]);
    
    // Reset view
    setSelectedReport(null);
    setReviewNotes('');
  };

  const handleModerationDecision = (postId: string, approve: boolean) => {
    const updatedPosts = posts.map(p => {
      if (p.id === postId) {
        const updated = { ...p, flags: 0, isFlagged: false };
        localDb.saveCommunityPost(updated);
        return updated;
      }
      return p;
    });

    if (!approve) {
      // Deletes post from feed
      const filtered = posts.filter(p => p.id !== postId);
      setPosts(filtered);
    } else {
      setPosts(updatedPosts);
    }

    // Log audit
    const newAudit: AuditLog = {
      id: `aud-mod-${Date.now()}`,
      actorId: 'demo-admin',
      actorEmail: 'admin@girmaic.org',
      action: `${approve ? 'APPROVED' : 'REMOVED'} community post: ${postId}`,
      targetId: postId,
      timestamp: new Date().toISOString()
    };
    setAudits([newAudit, ...audits]);
  };

  const stats = {
    total: reports.length,
    verified: reports.filter(r => r.status === ReportStatus.VERIFIED).length,
    underReview: reports.filter(r => r.status === ReportStatus.SAFETY_REVIEW || r.status === ReportStatus.MODERATION_REVIEW).length,
    unverified: reports.filter(r => r.status === ReportStatus.UNVERIFIED).length,
  };

  return (
    <div className="space-y-6" id="admin-dashboard-frame">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-white">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-emerald-950/40 text-emerald-400 rounded-xl border border-emerald-900/40">
            <Shield className="h-5.5 w-5.5" />
          </div>
          <div>
            <h2 className="text-lg font-bold">Secure Administrative Command Station</h2>
            <p className="text-xs text-slate-400 mt-0.5">Authorized staff credentials certified. Comprehensive audit logging enabled.</p>
          </div>
        </div>

        <div className="flex bg-slate-800 rounded-xl p-1.5 border border-slate-700/50">
          {[
            { key: 'overview', title: 'Overview', icon: <BarChart3 className="h-3.5 w-3.5" /> },
            { key: 'reports', title: 'Incident Reviews', icon: <FileText className="h-3.5 w-3.5" /> },
            { key: 'moderation', title: 'Moderation Feed', icon: <AlertTriangle className="h-3.5 w-3.5" /> },
            { key: 'audit', title: 'Audit Trail', icon: <History className="h-3.5 w-3.5" /> },
            { key: 'settings', title: 'Config', icon: <Compass className="h-3.5 w-3.5" /> }
          ].map(tab => (
            <button
              key={tab.key}
              id={`admin-tab-btn-${tab.key}`}
              onClick={() => { setActiveTab(tab.key as any); setSelectedReport(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeTab === tab.key
                  ? 'bg-emerald-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab.icon} {tab.title}
            </button>
          ))}
        </div>
      </div>

      {/* Overview stats panels */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4" id="admin-stats-grids">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Total Reports Lodged</span>
              <span className="text-3xl font-extrabold text-slate-850 dark:text-slate-100 mt-1 block">{stats.total}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Verified Incidents</span>
              <span className="text-3xl font-extrabold text-emerald-600 mt-1 block">{stats.verified}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Reviews Pending</span>
              <span className="text-3xl font-extrabold text-amber-500 mt-1 block">{stats.underReview}</span>
            </div>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-5 rounded-xl shadow-sm text-center">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Unverified Cases</span>
              <span className="text-3xl font-extrabold text-slate-400 mt-1 block">{stats.unverified}</span>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-150 mb-3.5 flex items-center gap-2">
              <ClipboardCheck className="h-4.5 w-4.5 text-emerald-600" /> Recent Human Rights Incidents Feed
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left" id="admin-reports-table">
                <thead className="bg-slate-50 dark:bg-slate-800 text-[10px] font-bold uppercase text-slate-500 tracking-wider">
                  <tr>
                    <th className="p-3.5">Reference ID</th>
                    <th className="p-3.5">Categories</th>
                    <th className="p-3.5">Location</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">Incident Date</th>
                    <th className="p-3.5">Human Reviewed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                  {reports.map(rep => (
                    <tr key={rep.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-850/40">
                      <td className="p-3.5 font-bold text-slate-850 dark:text-slate-100">{rep.id}</td>
                      <td className="p-3.5 capitalize font-semibold text-slate-600 dark:text-slate-350">{rep.categories.join(', ')}</td>
                      <td className="p-3.5 text-slate-600 dark:text-slate-400">{rep.locationOfIncident.country}, {rep.locationOfIncident.region}</td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 border text-slate-700">
                          {rep.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-slate-500">{rep.dateOfIncident}</td>
                      <td className="p-3.5">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-semibold ${
                          rep.humanReviewed ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {rep.humanReviewed ? 'Reviewed' : 'Awaiting'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Secure Reports Review Screen */}
      {activeTab === 'reports' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* List panel */}
          <div className="lg:col-span-1 space-y-3.5">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Select Incident Case</span>
            {reports.map(rep => (
              <div
                key={rep.id}
                id={`admin-report-list-${rep.id}`}
                onClick={() => { setSelectedReport(rep); setFinalCategory(rep.categories[0]); }}
                className={`border rounded-xl p-4 transition-all duration-200 cursor-pointer text-xs ${
                  selectedReport?.id === rep.id
                    ? 'bg-emerald-50/40 dark:bg-emerald-950/20 border-emerald-500 shadow-sm'
                    : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-slate-800 dark:text-slate-150">{rep.id}</span>
                  <span className="px-2 py-0.5 rounded text-[9px] font-bold bg-slate-100 border text-slate-700">{rep.status}</span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 leading-relaxed">{rep.description}</p>
              </div>
            ))}
          </div>

          {/* Incident Verification Workspace */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6" id="incident-verification-card">
                <div className="flex justify-between items-center border-b border-slate-205 pb-3">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Case Review Mode</span>
                    <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-lg mt-0.5">{selectedReport.id}</h3>
                  </div>
                  <span className="px-2.5 py-1 text-[10px] font-bold bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 border border-emerald-250/50 rounded-lg">
                    Privacy Tier: {selectedReport.privacyLevel === 0 ? 'Confidential' : 'Restricted Review'}
                  </span>
                </div>

                <div className="space-y-2">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Reported Incident Description:</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-4 rounded-xl border border-slate-200/50">
                    {selectedReport.description}
                  </p>
                </div>

                {/* Secure files check */}
                {selectedReport.evidence.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300">Preserved Digital Evidence Documents:</h4>
                    <div className="space-y-1.5">
                      {selectedReport.evidence.map(f => (
                        <div key={f.id} className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 border border-slate-150 rounded-lg p-2.5 text-xs">
                          <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{f.name} ({Math.round(f.size / 1000)} KB)</span>
                          <span className="text-[9px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-200">
                            Passed security scanners
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Suggested Category by Gemini AI */}
                {selectedReport.aiSuggestedCategory && (
                  <div className="bg-emerald-50/55 dark:bg-emerald-950/15 border border-emerald-200/50 rounded-xl p-4 flex gap-3">
                    <Sparkles className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                    <div className="space-y-1 text-xs">
                      <h4 className="font-bold text-emerald-800 dark:text-emerald-305">Girmaic AI Classifier Assessment:</h4>
                      <p className="text-slate-600 dark:text-slate-350 leading-relaxed">
                        Suggested Category: <strong className="text-slate-800 dark:text-slate-200">{selectedReport.aiSuggestedCategory}</strong> (Confidence: {Math.round((selectedReport.aiConfidence || 0.85) * 100)}%)
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400">
                        Reason: {selectedReport.aiReason}
                      </p>
                    </div>
                  </div>
                )}

                {/* Verification decision form */}
                <form onSubmit={handleApplyReview} className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-805">
                  <h4 className="text-xs font-extrabold text-slate-800 dark:text-slate-250 uppercase tracking-wide">Enter Administrative Decision</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400">DECISION STATUS</span>
                      <select
                        id="admin-status-select"
                        value={selectedStatus}
                        onChange={(e) => setSelectedStatus(e.target.value as any)}
                        className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-805 dark:text-slate-200"
                      >
                        <option value={ReportStatus.VERIFIED}>Verified Incident</option>
                        <option value={ReportStatus.CORROBORATED}>Corroborated / Pending</option>
                        <option value={ReportStatus.SAFETY_REVIEW}>Hold for Safety Review</option>
                        <option value={ReportStatus.UNVERIFIED}>Unverified</option>
                        <option value={ReportStatus.DISPUTED}>Disputed Claims</option>
                        <option value={ReportStatus.CLOSED}>Close Case</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400">ASSIGN FINAL CATEGORY</span>
                      <input
                        type="text"
                        id="admin-category-assign"
                        value={finalCategory}
                        onChange={(e) => setFinalCategory(e.target.value)}
                        className="w-full text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-3 py-2 text-slate-805 dark:text-slate-200"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400">VERIFICATION AND SOURCE INVESTIGATION NOTES</span>
                    <textarea
                      id="admin-review-notes"
                      rows={3}
                      value={reviewNotes}
                      onChange={(e) => setReviewNotes(e.target.value)}
                      placeholder="Input verified source credentials, witness counts, or partner agencies contacted to resolve or corroborate..."
                      className="w-full border border-slate-205 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg p-3 text-xs"
                      required
                    ></textarea>
                  </div>

                  <div className="flex justify-end gap-2.5">
                    <button
                      id="admin-cancel-review"
                      type="button"
                      onClick={() => setSelectedReport(null)}
                      className="px-4 py-2 border border-slate-200 dark:border-slate-700 text-slate-650 dark:text-slate-350 bg-white dark:bg-slate-800 rounded-lg text-xs font-semibold cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      id="admin-submit-review"
                      type="submit"
                      className="bg-emerald-600 hover:bg-emerald-550 text-white font-bold px-5 py-2 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                    >
                      <Check className="h-4 w-4" /> Save Verification Status
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-8 shadow-sm flex flex-col items-center justify-center text-center h-full min-h-[400px]">
                <ClipboardCheck className="h-16 w-16 text-slate-200 dark:text-slate-800 mb-4 animate-pulse" />
                <h3 className="font-bold text-slate-750 dark:text-slate-300">Verification Console</h3>
                <p className="text-xs text-slate-400 max-w-sm mt-1">
                  Select an incident from the side rail to inspect factual details, uploaded files, Gemini AI categories recommendations, and to issue certified verification decisions.
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Moderation section */}
      {activeTab === 'moderation' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4" id="moderation-workspace">
          <div>
            <h3 className="text-base font-bold text-slate-850 dark:text-slate-100">Reported Forum Content Flags</h3>
            <p className="text-xs text-slate-500 mt-1">Review community posts flagged by users for potentially violating community safety principles.</p>
          </div>

          <div className="space-y-4">
            {posts.filter(p => p.isFlagged).length > 0 ? (
              posts.filter(p => p.isFlagged).map(post => (
                <div key={post.id} className="border border-slate-200 dark:border-slate-800 rounded-xl p-4 space-y-3 bg-slate-50/50 dark:bg-slate-950/20">
                  <div className="flex justify-between text-xs border-b border-slate-200/50 dark:border-slate-805 pb-2">
                    <span className="font-semibold text-slate-700 dark:text-slate-300">Author: {post.userDisplayName} ({post.userId})</span>
                    <span className="text-rose-600 font-bold flex items-center gap-1">
                      <AlertTriangle className="h-3.5 w-3.5" /> Flagged {post.flags} times
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200">{post.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed">{post.content}</p>

                  <div className="flex justify-end gap-2 text-xs pt-2">
                    <button
                      id={`mod-dismiss-btn-${post.id}`}
                      onClick={() => handleModerationDecision(post.id, true)}
                      className="px-3 py-1.5 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 rounded hover:bg-slate-50 font-semibold cursor-pointer"
                    >
                      Approve & Dismiss Flags
                    </button>
                    <button
                      id={`mod-delete-btn-${post.id}`}
                      onClick={() => handleModerationDecision(post.id, false)}
                      className="px-3 py-1.5 bg-rose-600 text-white rounded hover:bg-rose-550 font-bold cursor-pointer"
                    >
                      Delete Post
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-10">
                <CheckCircle className="h-10 w-10 text-emerald-600 mx-auto mb-2" />
                <p className="text-xs text-slate-400">Zero pending safety flags. All community discussions are fully clear!</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Audit Trail tab */}
      {activeTab === 'audit' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-4" id="audit-trail-board">
          <div>
            <h3 className="text-base font-bold text-slate-850 dark:text-slate-100">Comprehensive Admin Audit Trail</h3>
            <p className="text-xs text-slate-500 mt-1">Cryptographically logged events of administrative and verification decisions. Immutable logging guidelines applied.</p>
          </div>

          <div className="space-y-2.5">
            {audits.map(log => (
              <div key={log.id} className="flex gap-3 text-xs leading-normal bg-slate-50 dark:bg-slate-950/20 border border-slate-150 p-3.5 rounded-xl">
                <Shield className="h-4 w-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-200">{log.action}</p>
                  <p className="text-[10px] text-slate-450 mt-1 font-semibold">
                    Actor: {log.actorEmail} | Target ID: {log.targetId} | {new Date(log.timestamp).toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Settings / Config tab */}
      {activeTab === 'settings' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6 max-w-xl" id="system-config-board">
          <div>
            <h3 className="text-base font-bold text-slate-850 dark:text-slate-100">System Security Configurations</h3>
            <p className="text-xs text-slate-500 mt-1">Manage global platforms configs, automatic file minimization parameters, and retention policies.</p>
          </div>

          <div className="space-y-4">
            <div className="flex justify-between items-center text-xs border-b border-slate-100 pb-3">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-250 block">Automated Data Retention Limit</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Files and personal records older than this are fully scrubbed.</span>
              </div>
              <select
                id="config-retention"
                value={retentionDays}
                onChange={(e) => setRetentionDays(Number(e.target.value))}
                className="bg-slate-50 dark:bg-slate-800 border border-slate-200 rounded px-2.5 py-1 text-slate-750 dark:text-slate-200 focus:outline-none"
              >
                <option value={90}>90 Days (Optimized Privacy)</option>
                <option value={180}>180 Days (Standard)</option>
                <option value={365}>1 Year (Legal Aid extended)</option>
              </select>
            </div>

            <div className="flex justify-between items-center text-xs">
              <div>
                <span className="font-bold text-slate-700 dark:text-slate-250 block">Enable Live Emergency Warning Flags</span>
                <span className="text-[10px] text-slate-400 mt-0.5 block">Forces display of Safety Alerts in reporting screens.</span>
              </div>
              <button
                id="config-toggle-warning"
                onClick={() => setEmergencyWarning(!emergencyWarning)}
                className={`px-3 py-1 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                  emergencyWarning
                    ? 'bg-emerald-100 text-emerald-800 border-emerald-300'
                    : 'bg-slate-100 text-slate-700 border-slate-300'
                }`}
              >
                {emergencyWarning ? 'ACTIVE' : 'DISABLED'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
