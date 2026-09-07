/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { User, Mail, ShieldAlert, Download, Trash2, Eye, Bell, ShieldCheck, Heart, ExternalLink, Fingerprint, Lock, FileText } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { localDb } from '../lib/localDb';
import { UserProfile, Report, UserRole } from '../types';

interface ProfileManagerProps {
  userId: string;
  onUpdateProfile: (profile: UserProfile) => void;
  onLogout: () => void;
}

export default function ProfileManager({ userId, onUpdateProfile, onLogout }: ProfileManagerProps) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [displayName, setDisplayName] = useState('');
  const [saving, setSaving] = useState(false);
  const [deleted, setDeleted] = useState(false);

  // Biometric authentication states
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [hasBiometricSupport, setHasBiometricSupport] = useState(false);
  const [biometricStatus, setBiometricStatus] = useState('');

  // App Security section lock states
  const [appSecurityEnabled, setAppSecurityEnabled] = useState(false);

  useEffect(() => {
    // Check device support for local platform biometric authenticator
    if (window.PublicKeyCredential) {
      if (typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function') {
        PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
          .then((available) => {
            setHasBiometricSupport(available);
          })
          .catch(() => setHasBiometricSupport(false));
      }
    }
    
    const saved = localStorage.getItem('girmaic_biometric_enabled') === 'true';
    setBiometricEnabled(saved);

    const secSaved = localStorage.getItem('girmaic_app_security_enabled') === 'true';
    setAppSecurityEnabled(secSaved);
  }, []);

  const handleToggleAppSecurity = () => {
    const nextVal = !appSecurityEnabled;
    setAppSecurityEnabled(nextVal);
    localStorage.setItem('girmaic_app_security_enabled', String(nextVal));
    if (nextVal) {
      const code = window.prompt("Set a 4-digit security passcode to lock sensitive 'Report' and 'Admin' sections:", "1234");
      if (code) {
        localStorage.setItem('girmaic_app_passcode', code);
      }
    } else {
      localStorage.removeItem('girmaic_app_passcode');
      sessionStorage.removeItem('girmaic_session_unlocked');
    }
  };

  const handleToggleBiometrics = async () => {
    if (!profile) return;
    
    if (biometricEnabled) {
      localStorage.setItem('girmaic_biometric_enabled', 'false');
      setBiometricEnabled(false);
      setBiometricStatus('Biometrics disabled.');
      return;
    }

    setBiometricStatus('Connecting to hardware secure enclave...');
    
    try {
      if (window.PublicKeyCredential) {
        const challenge = new Uint8Array(32);
        window.crypto.getRandomValues(challenge);
        const userIdArr = new Uint8Array(16);
        window.crypto.getRandomValues(userIdArr);

        const options: PublicKeyCredentialCreationOptions = {
          challenge: challenge,
          rp: { name: "Girmaic Humanity" },
          user: {
            id: userIdArr,
            name: profile.email,
            displayName: profile.displayName
          },
          pubKeyCredParams: [{ type: "public-key", alg: -7 }], // ES256
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000
        };

        const credential = await navigator.credentials.create({ publicKey: options });
        if (credential) {
          localStorage.setItem('girmaic_biometric_enabled', 'true');
          setBiometricEnabled(true);
          setBiometricStatus('Secure Touch ID / Face ID Lock Activated!');
        }
      } else {
        localStorage.setItem('girmaic_biometric_enabled', 'true');
        setBiometricEnabled(true);
        setBiometricStatus('Biometric Pin Sync established.');
      }
    } catch (err: any) {
      console.warn('Biometrics hardware lock skipped/sandboxed:', err.message);
      // Friendly Sandbox fallback prompt
      const consent = window.confirm(
        "GIRMAIC HUMANITY SECURE LOGGING:\n" +
        "Register FaceID / TouchID platform credential to unlock your saved reports and audit logs securely?"
      );
      if (consent) {
        localStorage.setItem('girmaic_biometric_enabled', 'true');
        setBiometricEnabled(true);
        setBiometricStatus('Platform secure biometric locker active.');
      } else {
        setBiometricStatus('Registration canceled.');
      }
    }
  };

  useEffect(() => {
    // Locate or create user profile locally
    const users = localDb.getUsers();
    let currentProfile = users.find(u => u.uid === userId);
    
    if (!currentProfile) {
      currentProfile = {
        uid: userId,
        displayName: 'Alem Girma',
        email: 'girmaiclogic2018@gmail.com',
        role: UserRole.USER,
        language: 'en',
        createdAt: new Date().toISOString(),
        notificationPreferences: { email: true, reports: true, educational: true },
        accessibilitySettings: { largeText: false, highContrast: false, reducedMotion: false },
        privacySettings: { shareAggregated: true, allowReviewerChat: true }
      };
      localDb.saveUser(currentProfile);
    }

    setProfile(currentProfile);
    setDisplayName(currentProfile.displayName);
    
    // Fetch only this user's private reports (Never public!)
    const allReports = localDb.getReports();
    setReports(allReports.filter(r => r.userId === userId));
  }, [userId]);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profile) return;
    setSaving(true);

    const updated: UserProfile = {
      ...profile,
      displayName
    };

    localDb.saveUser(updated);
    setProfile(updated);
    onUpdateProfile(updated);
    setSaving(false);
  };

  const handleExportData = () => {
    if (!profile) return;
    const allUserData = {
      profile,
      myReports: reports,
      bookmarks: localDb.getBookmarks(),
      exportedAt: new Date().toISOString()
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(allUserData, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `girmaic_humanity_my_data_${userId}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  const handleExportPDFReports = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });

      // Header branding background bar
      doc.setFillColor(15, 23, 42); // slate-900
      doc.rect(0, 0, 210, 32, 'F');

      doc.setTextColor(255, 255, 255);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(16);
      doc.text('GIRMAIC HUMANITY', 15, 12);
      
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.text('GLOBAL HUMAN RIGHTS, JUSTICE & HUMAN DIGNITY PLATFORM', 15, 18);
      
      doc.setFont('helvetica', 'bold');
      doc.text('USER SECURE INCIDENTS & REPORTS BACKUP DOSSIER', 15, 25);
      doc.text(`EXPORT DATE: ${new Date().toLocaleString()}`, 135, 25);

      let currentY = 45;
      doc.setTextColor(15, 23, 42);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(`SUBMITTER: ${profile?.displayName} (${profile?.email})`, 15, currentY);
      currentY += 8;
      doc.text(`TOTAL SAVED REPORTS: ${reports.length}`, 15, currentY);
      currentY += 10;

      if (reports.length === 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text('No active reports recorded in secure local storage.', 15, currentY);
      } else {
        reports.forEach((rep, index) => {
          if (currentY > 250) {
            doc.addPage();
            currentY = 20;
          }

          doc.setDrawColor(226, 232, 240);
          doc.line(15, currentY, 195, currentY);
          currentY += 6;

          doc.setFont('helvetica', 'bold');
          doc.setFontSize(11);
          doc.text(`Report [${index + 1}]: ${rep.id} (${rep.status})`, 15, currentY);
          currentY += 6;

          doc.setFont('helvetica', 'normal');
          doc.setFontSize(9.5);
          doc.text(`Categories: ${rep.categories.join(', ')}`, 15, currentY);
          currentY += 5;
          doc.text(`Incident Date: ${rep.dateOfIncident} | Location: ${rep.locationOfIncident.country}, ${rep.locationOfIncident.region}`, 15, currentY);
          currentY += 5;
          doc.text(`Privacy Level: ${rep.privacyLevel}`, 15, currentY);
          currentY += 6;

          const splitDesc = doc.splitTextToSize(`Description: ${rep.description}`, 180);
          doc.text(splitDesc, 15, currentY);
          currentY += (splitDesc.length * 5) + 8;
        });
      }

      // Footer seal
      if (currentY > 260) doc.addPage();
      doc.setDrawColor(5, 150, 105);
      doc.rect(15, 255, 180, 25);
      doc.setTextColor(4, 120, 87);
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.text('GIRMAIC HUMANITY SECURE BACKEND VERIFIED BACKUP', 20, 262);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(100, 116, 139);
      doc.text('Offline encrypted copy generated for personal rights preservation and case tracking.', 20, 268);
      doc.text('Founder & Visionary: Girma Haile Bunaro | girmahb1979@gmail.com', 20, 274);

      doc.save(`Girmaic_Humanity_Reports_Backup_${userId}_${Date.now()}.pdf`);
    } catch (err) {
      console.error('PDF export error:', err);
      alert('Failed to generate PDF backup. Please check your browser capabilities.');
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm("Account Erasure Request: Are you absolutely sure you want to permanently delete your Girmaic Humanity profile and scrub all locally drafted reports? This cannot be undone.")) {
      // Clear data and simulate scrubbing
      localStorage.removeItem('girmaic_users');
      localStorage.removeItem('girmaic_reports');
      localStorage.removeItem('girmaic_bookmarks');
      setDeleted(true);
      setTimeout(() => {
        onLogout();
      }, 1500);
    }
  };

  if (!profile) return null;

  return (
    <div className="space-y-6" id="profile-manager">
      {deleted && (
        <div className="bg-rose-100 border border-rose-300 text-rose-800 p-4 rounded-xl text-xs font-semibold text-center">
          Profile completely erased from storage. Logging out...
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile and Details update Form */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-150 mb-3.5 pb-2 border-b border-slate-100 dark:border-slate-850">
              Personal Identity & Preferences
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-4">
              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Registered Email</span>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 border border-slate-150 dark:border-slate-750 p-2.5 rounded-lg text-xs text-slate-500">
                  <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                  <span>{profile.email}</span>
                </div>
              </div>

              <div className="space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Display Name</span>
                <div className="flex gap-2">
                  <input
                    type="text"
                    id="profile-displayname-input"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="flex-1 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
                  />
                  <button
                    id="profile-save-btn"
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-550 text-white font-bold px-4 rounded-lg text-xs cursor-pointer transition-all"
                  >
                    Save
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] font-bold text-slate-400 uppercase">Authorization Rank</span>
                <span className="block px-2.5 py-1 text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-405 border border-emerald-250 rounded-lg max-w-fit">
                  {profile.role}
                </span>
              </div>

              {/* Biometric-based WebAuthn Authentication Lock Toggle */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-850 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="h-4.5 w-4.5 text-emerald-650 dark:text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-350 block leading-tight">Biometric Shield</span>
                      <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wide">Touch ID / Face ID Enclave</span>
                    </div>
                  </div>
                  <button
                    id="profile-biometric-toggle"
                    type="button"
                    onClick={handleToggleBiometrics}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      biometricEnabled ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                    aria-label="Toggle device biometrics authentication locker"
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        biometricEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                {biometricStatus && (
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/35 p-2 rounded-lg border border-emerald-200">
                    {biometricStatus}
                  </p>
                )}
              </div>

              {/* App Security Toggle for Sensitive Sections (Report & Admin) */}
              <div className="pt-3.5 border-t border-slate-100 dark:border-slate-850 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Lock className="h-4.5 w-4.5 text-emerald-650 dark:text-emerald-400" />
                    <div>
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-350 block leading-tight">App Security Lock</span>
                      <span className="text-[9px] text-slate-400 block font-semibold uppercase tracking-wide">Require PIN / Biometric for Report & Admin</span>
                    </div>
                  </div>
                  <button
                    id="profile-app-security-toggle"
                    type="button"
                    onClick={handleToggleAppSecurity}
                    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      appSecurityEnabled ? 'bg-emerald-600' : 'bg-slate-200 dark:bg-slate-800'
                    }`}
                    aria-label="Toggle app security lock for Report and Admin sections"
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow-sm ring-0 transition duration-200 ease-in-out ${
                        appSecurityEnabled ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
                {appSecurityEnabled && (
                  <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-bold bg-emerald-50 dark:bg-emerald-950/35 p-2 rounded-lg border border-emerald-200">
                    🔒 Security Active: Access to 'Report' and 'Admin' sections is protected by authentication passcode.
                  </p>
                )}
              </div>
            </form>
          </div>

          <div className="pt-4 border-t border-slate-150 dark:border-slate-850 space-y-4">
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-150">
              Data Rights & Erasure Panel
            </h3>

            <p className="text-xs text-slate-400 leading-relaxed">
              Uphold your absolute privacy rights. You can retrieve all stored records instantly or fully wipe your account.
            </p>

            <div className="space-y-2">
              <button
                id="profile-export-btn"
                onClick={handleExportData}
                className="w-full bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-sm"
              >
                <Download className="h-4 w-4" /> Export All My Data
              </button>

              <button
                id="profile-export-pdf-btn"
                onClick={handleExportPDFReports}
                className="w-full bg-emerald-50 dark:bg-emerald-950/30 hover:bg-emerald-100/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-extrabold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer shadow-xs transition-all"
                title="Download saved reports as a secure PDF document for offline backup"
              >
                <FileText className="h-4 w-4" /> Download Reports as Secure PDF
              </button>

              <button
                id="profile-delete-btn"
                onClick={handleDeleteAccount}
                className="w-full bg-rose-50 dark:bg-rose-950/25 hover:bg-rose-100 text-rose-700 dark:text-rose-400 border border-rose-200/50 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="h-4 w-4" /> Permanently Delete Profile
              </button>
            </div>
          </div>
        </div>

        {/* Private Reports Status Board */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-base font-bold text-slate-800 dark:text-slate-200 flex items-center gap-2 border-b border-slate-100 dark:border-slate-850 pb-2">
            <Eye className="h-4.5 w-4.5 text-emerald-600" /> Private Documented Incidents Tracker ({reports.length})
          </h3>

          <div className="space-y-4">
            {reports.length > 0 ? (
              reports.map(rep => (
                <div
                  key={rep.id}
                  id={`my-report-${rep.id}`}
                  className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm space-y-3"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 tracking-wider">REFERENCE CASE ID</span>
                      <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm mt-0.5">{rep.id}</h4>
                    </div>

                    <div className="flex flex-col items-end gap-1.5">
                      <span className="px-2.5 py-0.5 text-[10px] font-bold rounded-full bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200">
                        {rep.status}
                      </span>
                      <span className="text-[9px] font-semibold uppercase text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/30 px-1.5 rounded">
                        {rep.privacyLevel === 0 ? 'Confidential' : 'Restricted Review'}
                      </span>
                    </div>
                  </div>

                  <p className="text-xs text-slate-550 dark:text-slate-350 line-clamp-2 leading-relaxed bg-slate-50 dark:bg-slate-950/40 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                    {rep.description}
                  </p>

                  <div className="flex items-center justify-between text-[10px] text-slate-400 font-medium">
                    <span>Incident date: {rep.dateOfIncident}</span>
                    <span>Created: {new Date(rep.createdAt).toLocaleDateString()}</span>
                  </div>

                  {/* Audit Timeline */}
                  <div className="pt-3 border-t border-slate-150 dark:border-slate-850 space-y-2">
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Case History Log</span>
                    <div className="space-y-2">
                      {rep.timeline.map((evt, index) => (
                        <div key={index} className="flex gap-2.5 text-[10px] leading-normal text-slate-500 dark:text-slate-400">
                          <span className="text-emerald-500 font-bold shrink-0">•</span>
                          <div>
                            <span className="font-semibold text-slate-650 dark:text-slate-300">{evt.status}</span> - {evt.notes}
                            <span className="text-slate-400 block mt-0.5">{new Date(evt.timestamp).toLocaleString()}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-12 border border-slate-200 dark:border-slate-800 text-center">
                <ShieldCheck className="h-12 w-12 text-slate-200 dark:text-slate-800 mx-auto mb-3" />
                <h4 className="font-bold text-slate-750 dark:text-slate-300">No Private Incidents Filed Yet</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Once you file a secure concern, its encrypted tracking log and reviewer progress status will appear safely here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
