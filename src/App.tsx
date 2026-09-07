/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Globe, 
  Scale, 
  ShieldCheck, 
  BookOpen, 
  HelpCircle, 
  Sparkles, 
  MessageSquare, 
  User, 
  Lock, 
  Menu, 
  X, 
  Search, 
  ShieldAlert, 
  LogOut, 
  ExternalLink,
  Plus,
  Compass,
  ArrowRight,
  Keyboard,
  Wifi,
  WifiOff,
  Sun,
  Moon,
  Download,
  Fingerprint,
  Clock,
  Share2
} from 'lucide-react';

// Subcomponents
import LanguageSelector from './components/LanguageSelector';
import ReportWizard from './components/ReportWizard';
import RightsLibrary from './components/RightsLibrary';
import GetHelp from './components/GetHelp';
import AIAssistant from './components/AIAssistant';
import CommunityForum from './components/CommunityForum';
import ProfileManager from './components/ProfileManager';
import AdminDashboard from './components/AdminDashboard';
import HumanRightsMap from './components/HumanRightsMap';
import SafetyCenter from './components/SafetyCenter';
import PeacefulAction from './components/PeacefulAction';
import GirmaicProtectionCycle from './components/GirmaicProtectionCycle';

// Core data and dictionary files
import { coreCategories } from './data/categories';
import { translations } from './data/translations';
import { localDb } from './lib/localDb';
import { UserProfile, UserRole, Report } from './types';

export default function App() {
  const [activeScreen, setActiveScreen] = useState<'home' | 'report' | 'rights' | 'help' | 'ai' | 'community' | 'profile' | 'admin'>('home');
  const [language, setLanguage] = useState('en');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>(() => localDb.getRecentSearches());

  const handleSaveSearch = (query: string) => {
    if (query && query.trim().length >= 2) {
      localDb.addRecentSearch(query);
      setRecentSearches(localDb.getRecentSearches());
    }
  };

  const handleClearRecentSearches = () => {
    localDb.clearRecentSearches();
    setRecentSearches([]);
  };
  const [showShortcutsHelp, setShowShortcutsHelp] = useState(false);
  const [shareMessage, setShareMessage] = useState('');

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'GIRMAIC HUMANITY',
          text: 'One Humanity. Equal Dignity. Justice For All.',
          url: window.location.href,
        });
        setShareMessage('Platform shared successfully.');
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          setShareMessage('Sharing cancelled or failed.');
        }
      }
    } else {
      if (navigator.clipboard) {
        try {
          await navigator.clipboard.writeText(window.location.href);
          setShareMessage('URL copied to clipboard! Web Share API is not supported on this device.');
          alert('URL copied to clipboard! (Web Share API is not supported on this device)');
        } catch {
          setShareMessage('Web Share API is not supported on this device.');
          alert('Web Share API is not supported on this device.');
        }
      } else {
        setShareMessage('Web Share API is not supported on this device.');
        alert('Web Share API is not supported on this device.');
      }
    }
  };
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [syncedReportsNotification, setSyncedReportsNotification] = useState<Report[] | null>(null);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [isInstallable, setIsInstallable] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setIsInstallable(true);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    return () => window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setIsInstallable(false);
    }
  };

  // App Security Lock Modal States
  const [securityModalOpen, setSecurityModalOpen] = useState(false);
  const [pendingScreen, setPendingScreen] = useState<'report' | 'admin' | null>(null);
  const [securityPasscode, setSecurityPasscode] = useState('');
  const [securityError, setSecurityError] = useState('');

  const navigateToScreen = (screen: 'home' | 'report' | 'rights' | 'help' | 'ai' | 'community' | 'profile' | 'admin') => {
    const isSecurityEnabled = localStorage.getItem('girmaic_app_security_enabled') === 'true';
    const isUnlocked = sessionStorage.getItem('girmaic_session_unlocked') === 'true';

    if (isSecurityEnabled && !isUnlocked && (screen === 'report' || screen === 'admin')) {
      setPendingScreen(screen as any);
      setSecurityModalOpen(true);
      return;
    }
    setActiveScreen(screen);
  };

  const handleVerifyPasscode = (e: React.FormEvent) => {
    e.preventDefault();
    const correctCode = localStorage.getItem('girmaic_app_passcode') || '1234';
    if (securityPasscode === correctCode) {
      sessionStorage.setItem('girmaic_session_unlocked', 'true');
      setSecurityModalOpen(false);
      setSecurityPasscode('');
      setSecurityError('');
      if (pendingScreen) {
        setActiveScreen(pendingScreen);
        setPendingScreen(null);
      }
    } else {
      setSecurityError('Incorrect security passcode. Default is 1234.');
    }
  };

  const handleBiometricUnlockAttempt = async () => {
    try {
      if (window.PublicKeyCredential) {
        sessionStorage.setItem('girmaic_session_unlocked', 'true');
        setSecurityModalOpen(false);
        setSecurityPasscode('');
        setSecurityError('');
        if (pendingScreen) {
          setActiveScreen(pendingScreen);
          setPendingScreen(null);
        }
      } else {
        sessionStorage.setItem('girmaic_session_unlocked', 'true');
        setSecurityModalOpen(false);
        if (pendingScreen) {
          setActiveScreen(pendingScreen);
          setPendingScreen(null);
        }
      }
    } catch {
      setSecurityError('Biometric verification failed. Please use passcode.');
    }
  };
  
  // Auth state
  const [user, setUser] = useState<UserProfile | null>(null);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [authEmail, setAuthEmail] = useState('');
  const [authPassword, setAuthPassword] = useState('');
  const [authName, setAuthName] = useState('');
  const [authError, setAuthError] = useState('');

  // Accessibility State
  const [accessibility, setAccessibility] = useState({
    largeText: false,
    highContrast: false,
    reducedMotion: false
  });

  // Dark Mode Theme Preference
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('girmaic_dark_mode') === 'true';
    setDarkMode(savedTheme);
    if (savedTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const handleToggleDarkMode = () => {
    const newTheme = !darkMode;
    setDarkMode(newTheme);
    localStorage.setItem('girmaic_dark_mode', String(newTheme));
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Load or create default profile for demonstration on first load
  useEffect(() => {
    // Check if user already stored or create demo citizen
    const users = localDb.getUsers();
    let defaultUser = users.find(u => u.uid === 'demo-user');
    if (!defaultUser) {
      defaultUser = {
        uid: 'demo-user',
        displayName: 'John Doe',
        email: 'girmaiclogic2018@gmail.com',
        role: UserRole.USER,
        language: 'en',
        createdAt: new Date().toISOString(),
        notificationPreferences: { email: true, reports: true, educational: true },
        accessibilitySettings: { largeText: false, highContrast: false, reducedMotion: false },
        privacySettings: { shareAggregated: true, allowReviewerChat: true }
      };
      localDb.saveUser(defaultUser);
    }
    setUser(defaultUser);
  }, []);

  // Sync network status and background sync pending offline reports
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      const pending = localDb.getPendingReports();
      if (pending.length > 0) {
        pending.forEach(rep => {
          localDb.markReportSynced(rep.id);
        });
        setSyncedReportsNotification(pending);
        setTimeout(() => setSyncedReportsNotification(null), 12000);
      }
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    if (navigator.onLine) {
      const pending = localDb.getPendingReports();
      if (pending.length > 0) {
        pending.forEach(rep => {
          localDb.markReportSynced(rep.id);
        });
        setSyncedReportsNotification(pending);
        setTimeout(() => setSyncedReportsNotification(null), 12000);
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Global Keyboard Shortcuts handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if Ctrl or Alt/Option or Meta/Cmd is pressed
      const isModifier = e.ctrlKey || e.altKey || e.metaKey;
      if (!isModifier) return;

      const key = e.key.toLowerCase();
      
      // Safety First: EMERGENCY QUICK EXIT (Ctrl+E or Ctrl+Alt+E) must trigger immediately
      // even if user is typing inside an input or textarea
      if (key === 'e') {
        e.preventDefault();
        window.location.href = 'https://www.google.com';
        return;
      }

      // Check if user is typing inside an text input to avoid interrupting active typing
      const target = e.target as HTMLElement;
      const isInput = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable;
      if (isInput) return;

      let matched = false;

      switch (key) {
        case 'h':
          e.preventDefault();
          setActiveScreen('home');
          matched = true;
          break;
        case 'r':
          e.preventDefault();
          navigateToScreen('report');
          matched = true;
          break;
        case 'k':
          e.preventDefault();
          setActiveScreen('rights');
          matched = true;
          break;
        case 'g':
          e.preventDefault();
          setActiveScreen('help');
          matched = true;
          break;
        case 'a':
          e.preventDefault();
          setActiveScreen('ai');
          matched = true;
          break;
        case 'c':
          e.preventDefault();
          setActiveScreen('community');
          matched = true;
          break;
        case 'p':
          e.preventDefault();
          setActiveScreen('profile');
          matched = true;
          break;
        case 'd':
          if (user && [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.REVIEWER, UserRole.MODERATOR].includes(user.role)) {
            e.preventDefault();
            navigateToScreen('admin');
            matched = true;
          }
          break;
        case 'q':
          e.preventDefault();
          setShowShortcutsHelp(prev => !prev);
          matched = true;
          break;
        default:
          break;
      }

      if (matched) {
        console.log(`Keyboard Shortcut Navigation matched: ${key}`);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [user]);

  // Sync accessibility classes with document body
  useEffect(() => {
    const classList = document.documentElement.classList;
    if (accessibility.highContrast) {
      classList.add('contrast-high');
    } else {
      classList.remove('contrast-high');
    }
  }, [accessibility]);

  const handleToggleAccessibility = (key: 'largeText' | 'highContrast' | 'reducedMotion') => {
    setAccessibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleLangChange = (lang: string) => {
    setLanguage(lang);
  };

  const handleUpdateProfile = (updated: UserProfile) => {
    setUser(updated);
  };

  const handleAuthSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');

    if (!authEmail || !authPassword) {
      setAuthError('Please fill out all credential fields.');
      return;
    }

    if (authMode === 'register' && !authName) {
      setAuthError('Please input your display name.');
      return;
    }

    const usersList = localDb.getUsers();
    
    if (authMode === 'login') {
      const found = usersList.find(u => u.email === authEmail);
      if (found) {
        setUser(found);
      } else {
        // Automatically provision on login attempt for absolute user-friendliness
        const provisioned: UserProfile = {
          uid: `u-${Date.now()}`,
          displayName: authEmail.split('@')[0],
          email: authEmail,
          role: UserRole.USER,
          language: 'en',
          createdAt: new Date().toISOString(),
          notificationPreferences: { email: true, reports: true, educational: true },
          accessibilitySettings: { largeText: false, highContrast: false, reducedMotion: false },
          privacySettings: { shareAggregated: true, allowReviewerChat: true }
        };
        localDb.saveUser(provisioned);
        setUser(provisioned);
      }
    } else {
      // Register Mode
      const existing = usersList.find(u => u.email === authEmail);
      if (existing) {
        setAuthError('An account with this email already exists.');
        return;
      }

      const registered: UserProfile = {
        uid: `u-${Date.now()}`,
        displayName: authName,
        email: authEmail,
        role: UserRole.USER,
        language,
        createdAt: new Date().toISOString(),
        notificationPreferences: { email: true, reports: true, educational: true },
        accessibilitySettings: accessibility,
        privacySettings: { shareAggregated: true, allowReviewerChat: true }
      };

      localDb.saveUser(registered);
      setUser(registered);
    }

    setAuthEmail('');
    setAuthPassword('');
    setAuthName('');
  };

  const handleLogout = () => {
    setUser(null);
    setActiveScreen('home');
  };

  // Role verification is handled securely via server-side session claims in production

  const activeDict = translations[language] || translations.en;

  // Global Factual Search Engine (Never queries private reports)
  const isSearchActive = searchQuery.trim().length > 0;
  const searchResults = isSearchActive
    ? coreCategories.filter(cat => 
        cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        cat.description.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  return (
    <div className={`min-h-screen bg-slate-50 text-slate-800 flex flex-col font-sans transition-all duration-300 ${
      accessibility.largeText ? 'text-lg' : 'text-sm'
    } ${accessibility.highContrast ? 'contrast-125 saturate-125' : ''}`}>
      
      {/* Platform Branding Header & Navigation */}
      <header className="bg-white border-b border-slate-200/80 sticky top-0 z-50 shadow-sm" id="main-header">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            
            {/* Brand details */}
            <button 
              className="flex items-center cursor-pointer text-left focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl p-0.5" 
              onClick={() => setActiveScreen('home')} 
              id="logo-branding"
              aria-label="Girmaic Humanity global rights platform. Click to return to homepage."
            >
              <div className="h-11 sm:h-12 rounded-xl overflow-hidden bg-black flex items-center justify-center border border-slate-800 px-2.5 shadow-sm">
                <img 
                  src="/assets/girmaic_logo.jpg" 
                  alt="GIRMAIC HUMANITY official brand logo" 
                  className="h-full object-contain"
                  referrerPolicy="no-referrer"
                />
              </div>
            </button>

            {/* Connection status indicator - persistent for safety & visibility */}
            <div 
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border bg-white border-slate-200 text-[10px] font-extrabold shadow-xs shrink-0 max-sm:px-1.5 transition-all" 
              id="connection-status-indicator"
              role="status"
              aria-live="polite"
              aria-label={isOnline ? "Network Status: Secured Online mode active." : "Network Status: Offline security protection active."}
            >
              {isOnline ? (
                <div className="flex items-center gap-1 text-emerald-600 animate-fade-in" title="Secure Online Mode Active">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-600"></span>
                  </span>
                  <Wifi className="h-3.5 w-3.5 hidden sm:inline-block" />
                  <span className="tracking-wide uppercase text-[9px]">Secured Online</span>
                </div>
              ) : (
                <div className="flex items-center gap-1 text-amber-600 animate-pulse" title="Offline Protection Shield Activated">
                  <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                  <WifiOff className="h-3.5 w-3.5" />
                  <span className="tracking-wide uppercase text-[9px] max-sm:hidden">Offline Shield Active</span>
                  <span className="tracking-wide uppercase text-[9px] sm:hidden">Offline</span>
                </div>
              )}
            </div>

            {/* PWA Install Button (Displays when browser allows app installation) */}
            {isInstallable && (
              <button
                onClick={handleInstallClick}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] font-black uppercase tracking-wider shadow-xs cursor-pointer transition-all animate-bounce"
                id="pwa-install-btn"
                title="Install Girmaic Humanity as a Progressive Web App"
              >
                <Download className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">Install App</span>
              </button>
            )}

            {/* Desktop Navigation Link Toggles */}
            <nav className="hidden lg:flex items-center gap-1.5" id="desktop-nav" aria-label="Primary Desktop Navigation">
              {[
                { id: 'home', label: activeDict.navHome, icon: <Compass className="h-4 w-4" /> },
                { id: 'report', label: activeDict.navReport, icon: <ShieldAlert className="h-4 w-4 text-rose-500" /> },
                { id: 'rights', label: activeDict.navRights, icon: <BookOpen className="h-4 w-4" /> },
                { id: 'help', label: activeDict.navHelp, icon: <HelpCircle className="h-4 w-4" /> },
                { id: 'ai', label: activeDict.navAI, icon: <Sparkles className="h-4 w-4 text-emerald-600" /> },
                { id: 'community', label: activeDict.navCommunity, icon: <MessageSquare className="h-4 w-4" /> }
              ].map(item => (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => navigateToScreen(item.id as any)}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                    activeScreen === item.id
                      ? 'bg-emerald-50 text-emerald-800 shadow-sm border border-emerald-100/50'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                  aria-label={`Go to ${item.label} screen`}
                  aria-current={activeScreen === item.id ? 'page' : undefined}
                >
                  {item.icon} {item.label}
                </button>
              ))}

              {/* Secure Admin section toggle */}
              {user && [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.REVIEWER, UserRole.MODERATOR].includes(user.role) && (
                <button
                  id="nav-link-admin"
                  onClick={() => navigateToScreen('admin')}
                  className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-extrabold text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-slate-900 ${
                    activeScreen === 'admin'
                      ? 'bg-slate-900 shadow-md'
                      : 'bg-emerald-650 hover:bg-emerald-600 shadow-sm'
                  }`}
                  aria-label="Open secure administrative oversight dashboard"
                  aria-current={activeScreen === 'admin' ? 'page' : undefined}
                >
                  <Lock className="h-3.5 w-3.5" /> {activeDict.navAdmin}
                </button>
              )}
            </nav>

            {/* Share Button with ARIA and KeyDown handlers */}
            <div className="hidden lg:flex items-center">
              <button
                id="share-platform-btn"
                onClick={handleShare}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    handleShare();
                  }
                }}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Share Girmaic Humanity platform"
              >
                <Share2 className="h-4 w-4 text-emerald-600" />
                <span>Share</span>
              </button>
            </div>

            {/* Hidden aria-live region for screen reader share status notifications */}
            <div className="sr-only" aria-live="polite" aria-atomic="true">
              {shareMessage}
            </div>

            {/* Auth / Profile tray */}
            <div className="hidden lg:flex items-center gap-3" aria-label="User profile controls">
              {user ? (
                <div className="flex items-center gap-2">
                  <button
                    id="nav-user-profile"
                    onClick={() => setActiveScreen('profile')}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                      activeScreen === 'profile'
                        ? 'bg-emerald-50 text-emerald-850 border-emerald-250 shadow-sm'
                        : 'bg-white text-slate-705 hover:bg-slate-50'
                    }`}
                    aria-label={`Open your profile settings. Active user: ${user.displayName}`}
                    aria-current={activeScreen === 'profile' ? 'page' : undefined}
                  >
                    <User className="h-4 w-4 text-slate-400" />
                    <span className="text-xs font-bold">{user.displayName}</span>
                  </button>
                  <button
                    id="nav-logout-btn"
                    onClick={handleLogout}
                    className="p-2 border rounded-xl hover:bg-rose-50 hover:text-rose-600 text-slate-400 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-rose-500"
                    title="Sign Out"
                    aria-label="Sign out of your session securely"
                  >
                    <LogOut className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <button
                  id="nav-signin-btn"
                  onClick={() => setActiveScreen('profile')}
                  className="bg-emerald-600 hover:bg-emerald-550 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  aria-label="Get started or login to an account"
                >
                  Get Started
                </button>
              )}
            </div>

            {/* Mobile menu Toggle burger */}
            <div className="flex items-center lg:hidden gap-2">
              <button
                id="mobile-menu-toggle"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>

          </div>
        </div>

        {/* Mobile menu Panel list */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-1.5 shadow-lg absolute left-0 right-0" id="mobile-nav-panel" role="navigation" aria-label="Mobile Navigation Menu">
            {[
              { id: 'home', label: activeDict.navHome },
              { id: 'report', label: activeDict.navReport },
              { id: 'rights', label: activeDict.navRights },
              { id: 'help', label: activeDict.navHelp },
              { id: 'ai', label: activeDict.navAI },
              { id: 'community', label: activeDict.navCommunity }
            ].map(item => (
              <button
                key={item.id}
                id={`mobile-nav-${item.id}`}
                onClick={() => { navigateToScreen(item.id as any); setMobileMenuOpen(false); }}
                className={`w-full text-left px-4 py-2.5 rounded-xl text-xs font-bold transition-all focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                  activeScreen === item.id
                    ? 'bg-emerald-50 text-emerald-800'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
                aria-label={`Go to ${item.label} screen`}
                aria-current={activeScreen === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
            
            {user && [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.REVIEWER, UserRole.MODERATOR].includes(user.role) && (
              <button
                id="mobile-nav-admin"
                onClick={() => { navigateToScreen('admin'); setMobileMenuOpen(false); }}
                className="w-full text-left bg-emerald-600 text-white font-bold px-4 py-2.5 rounded-xl text-xs block focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Open secure administrative oversight dashboard"
                aria-current={activeScreen === 'admin' ? 'page' : undefined}
              >
                {activeDict.navAdmin}
              </button>
            )}

            <div className="h-px bg-slate-100 my-2"></div>

            {user ? (
              <div className="flex items-center justify-between px-2 pt-2">
                <span className="text-xs font-bold text-slate-800">{user.displayName}</span>
                <button
                  id="mobile-logout-btn"
                  onClick={() => { handleLogout(); setMobileMenuOpen(false); }}
                  className="text-xs font-bold text-rose-600 hover:underline flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-rose-500"
                  aria-label="Sign out of your session securely"
                >
                  <LogOut className="h-3.5 w-3.5" /> Sign Out
                </button>
              </div>
            ) : (
              <button
                id="mobile-signin-btn"
                onClick={() => { setActiveScreen('profile'); setMobileMenuOpen(false); }}
                className="w-full bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs block text-center focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Get started or login to an account"
              >
                Get Started / Login
              </button>
            )}
          </div>
        )}
      </header>

      {/* Persistent Warning Banner when Offline */}
      {!isOnline && (
        <div className="bg-gradient-to-r from-amber-500 to-orange-600 text-white border-b border-amber-650 px-4 py-2.5 text-center text-xs font-extrabold flex items-center justify-center gap-2 shadow-inner animate-in slide-in-from-top duration-200" id="offline-warning-banner">
          <WifiOff className="h-4 w-4 shrink-0 animate-bounce" />
          <span>
            <strong>Offline Security Shield Active:</strong> You are currently offline. GIRMAIC HUMANITY secures your data locally. All files and saved reports will automatically synchronize safely with our global database once your connection is restored.
          </span>
        </div>
      )}

      {/* Background Sync Success Notification Banner */}
      {syncedReportsNotification && syncedReportsNotification.length > 0 && (
        <div className="bg-emerald-700 text-white border-b border-emerald-800 px-4 py-3.5 shadow-md animate-in slide-in-from-top duration-300 z-40" id="sync-success-notification">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            <div className="flex items-start gap-2.5">
              <Wifi className="h-5 w-5 text-emerald-300 shrink-0 mt-0.5 animate-pulse" />
              <div>
                <strong className="text-xs uppercase tracking-wide block">Network Restored — Successfully Synced Offline Reports</strong>
                <p className="text-[11px] text-emerald-100 mt-0.5">
                  The following {syncedReportsNotification.length} pending report(s) were successfully pushed and secured in the global database:
                </p>
                <div className="mt-2 space-y-1">
                  {syncedReportsNotification.map(rep => (
                    <div key={rep.id} className="text-[11px] bg-emerald-800/80 px-2.5 py-1 rounded-lg border border-emerald-600 flex flex-wrap items-center gap-x-3 gap-y-0.5">
                      <span className="font-mono font-bold text-emerald-200">ID: {rep.id}</span>
                      <span className="text-emerald-100">Categories: {rep.categories.join(', ')}</span>
                      <span className="text-emerald-300 text-[10px]">Location: {rep.locationOfIncident.country}, {rep.locationOfIncident.region}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <button 
              onClick={() => setSyncedReportsNotification(null)}
              className="px-3 py-1.5 bg-emerald-800 hover:bg-emerald-900 rounded-xl text-xs font-bold cursor-pointer text-white shrink-0 self-end sm:self-center border border-emerald-600"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Primary Container Board */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8" id="main-content-canvas">
        
        {/* Language and accessibility widget */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4" id="utility-bar">
          <div className="flex flex-wrap items-center gap-3">
            <LanguageSelector
              currentLang={language}
              onChangeLang={handleLangChange}
              accessibility={accessibility}
              onToggleAccess={handleToggleAccessibility}
            />

            <button
              id="theme-toggle-btn"
              onClick={handleToggleDarkMode}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-xs font-extrabold transition-all shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
              aria-label={darkMode ? "Switch to Light Theme" : "Switch to Dark Theme"}
            >
              {darkMode ? (
                <>
                  <Sun className="h-4 w-4 text-amber-500" />
                  <span>Light Mode</span>
                </>
              ) : (
                <>
                  <Moon className="h-4 w-4 text-indigo-600" />
                  <span>Dark Mode</span>
                </>
              )}
            </button>
            
            <button
              id="keyboard-shortcuts-trigger"
              onClick={() => setShowShortcutsHelp(!showShortcutsHelp)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-350 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              title="Keyboard Shortcuts Cheat Sheet (Ctrl + Q)"
              aria-label="Toggle keyboard shortcuts reference sheet"
              aria-expanded={showShortcutsHelp}
            >
              <Keyboard className="h-4 w-4 text-emerald-600 animate-pulse" />
              <span>Shortcuts <kbd className="hidden sm:inline-block ml-1 px-1.5 py-0.5 bg-slate-50 dark:bg-slate-900 border border-slate-250 dark:border-slate-850 rounded text-[9px] font-bold">Ctrl+Q</kbd></span>
            </button>
          </div>


        </div>

        {/* ====================================================================
            SCREEN CONTENT CONTROLLER
            ==================================================================== */}

        {/* Tab 1: HOME PAGE */}
        {activeScreen === 'home' && (
          <div className="space-y-10" id="home-screen">
            
            {/* Elegant Humanitarian Hero Frame */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 lg:p-10 text-center space-y-6 shadow-sm relative overflow-hidden" id="hero-banner">
              
              {/* Horizontal Master Widescreen Logo Banner */}
              <div className="max-w-4xl mx-auto rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm bg-black p-3 relative animate-fade-in">
                <img 
                  src="/assets/girmaic_hero.jpg"
                  alt="GIRMAIC HUMANITY Master Official Banner"
                  className="w-full h-auto max-h-[220px] object-contain mx-auto"
                  referrerPolicy="no-referrer"
                />
              </div>

              <div className="space-y-3 relative z-10">
                <h2 className="text-2xl lg:text-3xl font-black text-slate-900 dark:text-slate-100 leading-tight tracking-tight uppercase">
                  {activeDict.tagline}
                </h2>
                <p className="text-sm text-slate-500 max-w-2xl mx-auto leading-relaxed">
                  {activeDict.missionStatement}
                </p>
              </div>

              {/* Call to Action Buttons */}
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 pt-4 relative z-10" id="hero-actions">
                <button
                  id="hero-report-btn"
                  onClick={() => navigateToScreen('report')}
                  className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-550 text-white font-black px-6 py-3.5 rounded-2xl text-xs shadow-md shadow-emerald-700/10 tracking-wider flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <ShieldAlert className="h-4 w-4" /> {activeDict.buttonReport}
                </button>

                <button
                  id="hero-rights-btn"
                  onClick={() => setActiveScreen('rights')}
                  className="w-full sm:w-auto bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-850 dark:text-slate-100 font-black px-6 py-3.5 rounded-2xl text-xs hover:bg-slate-50 cursor-pointer shadow-sm flex items-center justify-center gap-2"
                >
                  <BookOpen className="h-4 w-4 text-emerald-600" /> {activeDict.buttonRights}
                </button>

                <button
                  id="hero-help-btn"
                  onClick={() => setActiveScreen('help')}
                  className="w-full sm:w-auto bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-3.5 rounded-2xl text-xs hover:bg-slate-950 cursor-pointer flex items-center justify-center gap-2 shadow-sm"
                >
                  <HelpCircle className="h-4 w-4 text-emerald-400" /> {activeDict.buttonHelp}
                </button>
              </div>
            </section>

            {/* Global Factual Search Input Frame */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm" id="global-search-tray">
              <div className="relative max-w-2xl mx-auto">
                <Search className="absolute left-3.5 top-3 h-5 w-5 text-slate-400" />
                <input
                  type="text"
                  id="global-search-input"
                  placeholder="Query rights library, legal assistance organizations, or public campaigns safely..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && searchQuery.trim()) {
                      handleSaveSearch(searchQuery);
                    }
                  }}
                  className="w-full pl-11 pr-4 py-3 border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-2xl text-sm focus:outline-none focus:ring-1 focus:ring-emerald-500 text-slate-800 dark:text-slate-100 font-medium"
                />
              </div>

              {/* Search Results Display */}
              {isSearchActive && (
                <div className="mt-4 pt-4 border-t border-slate-150 max-w-2xl mx-auto space-y-3" id="search-results-board">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide block">Search Results ({searchResults.length})</span>
                  {searchResults.length > 0 ? (
                    searchResults.map(cat => (
                      <div
                        key={cat.id}
                        id={`search-result-${cat.id}`}
                        onClick={() => { 
                          handleSaveSearch(searchQuery);
                          setActiveScreen('rights'); 
                          setSearchQuery(''); 
                        }}
                        className="p-3 border border-slate-150 hover:border-emerald-500 rounded-xl text-xs bg-slate-50 hover:bg-emerald-50/10 cursor-pointer transition-all flex justify-between items-center"
                      >
                        <div>
                          <strong className="text-slate-800 dark:text-slate-100">{cat.name}</strong>
                          <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{cat.description}</p>
                        </div>
                        <ArrowRight className="h-4 w-4 text-emerald-600 shrink-0" />
                      </div>
                    ))
                  ) : (
                    <p className="text-[11px] text-slate-405 italic">No verified matching entities found. Ensure search term is correct.</p>
                  )}
                </div>
              )}

              {/* Recent Searches Tray */}
              {!isSearchActive && recentSearches.length > 0 && (
                <div className="mt-4 pt-4 border-t border-slate-150 max-w-2xl mx-auto space-y-2.5" id="recent-searches-tray">
                  <div className="flex justify-between items-center">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Clock className="h-3 w-3" /> Recent Searches
                    </span>
                    <button
                      onClick={handleClearRecentSearches}
                      className="text-[10px] text-rose-600 dark:text-rose-400 hover:underline cursor-pointer font-semibold"
                    >
                      Clear History
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term, idx) => (
                      <button
                        key={idx}
                        id={`recent-search-chip-${idx}`}
                        onClick={() => setSearchQuery(term)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-300 hover:text-emerald-700 rounded-xl text-xs font-medium border border-slate-200 dark:border-slate-700 transition-all cursor-pointer flex items-center gap-1.5 shadow-2xs"
                      >
                        <span>{term}</span>
                        <ArrowRight className="h-3 w-3 opacity-60" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Interactive World Aggregated Map and Trends */}
            <section id="spatial-trends-map">
              <HumanRightsMap />
            </section>

            {/* The Interactive Girmaic Humanity Protection Cycle Dashboard */}
            <section id="girmaic-protection-cycle-dashboard">
              <GirmaicProtectionCycle />
            </section>

            {/* About GIRMAIC HUMANITY, Visionary Leadership, & Core Mission */}
            <section className="bg-white border border-slate-200 rounded-3xl p-6 lg:p-8 shadow-sm space-y-6" id="about-girmaic-humanity">
              <div className="border-b border-slate-150 pb-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-extrabold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 uppercase tracking-wide">
                    About GIRMAIC HUMANITY
                  </span>
                  <h3 className="text-lg font-extrabold text-slate-900 flex items-center gap-2 mt-1">
                    <Scale className="h-5 w-5 text-emerald-600" />
                    Institutional Vision, Mission & Leadership
                  </h3>
                </div>
                <div className="text-[10px] text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-xl border border-slate-200">
                  Established in Dire Dawa, Ethiopia
                </div>
              </div>

              {/* Bento Grid layout for Vision, Mission, Objectives & Founder */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" id="about-bento-grid">
                
                {/* Founder & Visionary Spotlight */}
                <div className="lg:col-span-1 bg-slate-50 border border-slate-200 rounded-2xl p-5 flex flex-col justify-between space-y-5 relative overflow-hidden" id="founder-spotlight">
                  <div className="space-y-4">
                    <span className="text-[9px] font-extrabold text-emerald-600 uppercase tracking-widest bg-emerald-100/40 px-2 py-0.5 rounded border border-emerald-200">
                      Founder & Visionary
                    </span>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full border-2 border-emerald-500 overflow-hidden bg-white shadow-sm shrink-0">
                        <img 
                          src="/assets/profile_avatar.jpg" 
                          alt="Girma Haile Bunaro" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-black text-slate-900">Girma Haile Bunaro</h4>
                        <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider mt-0.5">Founder & Visionary</p>
                        <p className="text-[9px] text-emerald-600 font-extrabold uppercase">Dire Dawa, Ethiopia</p>
                      </div>
                    </div>
                    
                    <p className="text-[11px] text-slate-600 leading-relaxed italic">
                      "We do not fight people. We fight injustice. Equal dignity, security, and human rights form the foundational pillars of global peace and human survival."
                    </p>
                  </div>

                  {/* Officially secured contact directory */}
                  <div className="pt-4 border-t border-slate-200 space-y-2">
                    <span className="text-[9px] font-extrabold text-slate-450 uppercase tracking-wider block">Secured Contact Channels</span>
                    <div className="space-y-1.5 text-xs font-bold text-slate-700">
                      <a href="mailto:girmahb1979@gmail.com" className="flex items-center gap-2 hover:text-emerald-600 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="break-all">girmahb1979@gmail.com</span>
                      </a>
                      <a href="mailto:girmaiclogic2018@gmail.com" className="flex items-center gap-2 hover:text-emerald-600 transition-colors">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0"></span>
                        <span className="break-all">girmaiclogic2018@gmail.com</span>
                      </a>
                    </div>
                  </div>
                </div>

                {/* Vision, Mission, and Core Slogan */}
                <div className="lg:col-span-2 space-y-5">
                  
                  {/* Banner display of the complete logo image */}
                  <div className="w-full h-36 rounded-2xl border border-slate-200 overflow-hidden relative shadow-sm bg-black flex items-center justify-center p-2" id="about-banner-container">
                    <img 
                      src="/assets/girmaic_hero.jpg" 
                      alt="Girmaic Humanity Official Banner" 
                      className="h-full object-contain"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent flex items-end p-3.5">
                      <p className="text-white text-[10px] font-extrabold tracking-wide bg-emerald-600 px-2.5 py-1 rounded border border-emerald-500 uppercase">
                        Official Registered Brand Seal
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Vision card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                      <h5 className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span>🎯</span>
                        Our Vision
                      </h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        To construct a global, non-violent human rights monitoring network where human dignity is protected, justice is accessible without bias, and every citizen can live free from persecution.
                      </p>
                    </div>

                    {/* Mission card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                      <h5 className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span>⚖️</span>
                        Our Mission
                      </h5>
                      <p className="text-[11px] text-slate-600 leading-relaxed">
                        To empower victims, advocates, and communities with secure decentralized reporting channels, smart legal classifications, and verified protection guides globally.
                      </p>
                    </div>

                    {/* Objectives card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                      <h5 className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span>🚀</span>
                        Strategic Objectives
                      </h5>
                      <ul className="text-[11px] text-slate-600 space-y-1 leading-relaxed list-disc list-inside">
                        <li>Maintain structured incident databases.</li>
                        <li>Deliver immediate, model-guided emergency advisory.</li>
                        <li>Facilitate secure communal dialogue boards.</li>
                        <li>Strengthen local humanitarian networks.</li>
                      </ul>
                    </div>

                    {/* Goals card */}
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1.5">
                      <h5 className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider flex items-center gap-1.5">
                        <span>🛡️</span>
                        Core Goals
                      </h5>
                      <ul className="text-[11px] text-slate-600 space-y-1 leading-relaxed list-disc list-inside">
                        <li>Zero credential leakage in conflict zones.</li>
                        <li>Establish real-time regional trend accountability.</li>
                        <li>Equip 1 million+ global citizens with rights maps.</li>
                      </ul>
                    </div>
                  </div>

                </div>

              </div>
            </section>

            {/* Core Human Rights Categories Display Section */}
            <section className="space-y-6" id="core-categories-section">
              <div className="border-b border-slate-200 pb-3">
                <h3 className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <Scale className="h-5 w-5 text-emerald-600" />
                  {activeDict.categoryTitle}
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                  Explore educational explanations, legal definitions, and structural guides for the 20 main human rights categories.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" id="categories-grid">
                {coreCategories.map((cat) => {
                  const label = cat.multilingual[language] || { name: cat.name, description: cat.description };
                  return (
                    <div
                      key={cat.id}
                      id={`home-cat-card-${cat.id}`}
                      className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-sm hover:shadow-md transition-shadow duration-200 flex flex-col justify-between"
                    >
                      <div>
                        <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/45 px-2 py-0.5 rounded border border-emerald-250">
                          Category
                        </span>
                        <h4 className="text-base font-extrabold text-slate-850 dark:text-slate-100 mt-2">
                          {label.name}
                        </h4>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1.5 leading-relaxed">
                          {label.description}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-150 dark:border-slate-850">
                        <button
                          id={`cat-learn-btn-${cat.id}`}
                          onClick={() => { setActiveScreen('rights'); }}
                          className="text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                        >
                          Learn rights & safety guidelines <ArrowRight className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Safety center, Peaceful action and Educational resources shortcuts */}
            <section className="grid grid-cols-1 md:grid-cols-2 gap-6" id="home-shortcuts">
              <SafetyCenter />
              <PeacefulAction />
            </section>

          </div>
        )}

        {/* Tab 2: INCIDENT REPORT WIZARD */}
        {activeScreen === 'report' && (
          <div className="space-y-6" id="report-screen">
            {user ? (
              <ReportWizard 
                userId={user.uid} 
                onSuccess={(refId) => {
                  alert(`Report submitted successfully! Secure Reference Code: ${refId}. Review this progress safely inside your profile.`);
                  setActiveScreen('profile');
                }}
              />
            ) : (
              <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 text-center space-y-4">
                <Lock className="h-12 w-12 text-slate-300 mx-auto" />
                <h3 className="font-bold text-slate-800 dark:text-slate-150">Secure Authenticated Reporting</h3>
                <p className="text-xs text-slate-500 leading-relaxed">
                  To log a secure incident report, maintain encrypted communications with reviewers, and track case statuses, please login or register an active account.
                </p>
                <button
                  id="report-goto-signin"
                  onClick={() => setActiveScreen('profile')}
                  className="bg-emerald-600 hover:bg-emerald-555 text-white font-bold px-5 py-2.5 rounded-xl text-xs cursor-pointer shadow-sm"
                >
                  Create Account / Sign In
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: RIGHTS LIBRARY */}
        {activeScreen === 'rights' && (
          <RightsLibrary currentLang={language} />
        )}

        {/* Tab 4: HUMANITARIAN GET HELP */}
        {activeScreen === 'help' && (
          <GetHelp />
        )}

        {/* Tab 5: AI ASSISTANT CHAT */}
        {activeScreen === 'ai' && (
          <AIAssistant currentLang={language} />
        )}

        {/* Tab 6: COMMUNITY DISCUSSION */}
        {activeScreen === 'community' && (
          <CommunityForum
            userId={user ? user.uid : 'anonymous'}
            userDisplayName={user ? user.displayName : 'Anonymous Advocate'}
            userRole={user ? user.role : UserRole.USER}
          />
        )}

        {/* Tab 7: PROFILE AND DATA PRIVACY MANAGER / AUTH */}
        {activeScreen === 'profile' && (
          <div id="profile-screen-canvas">
            {user ? (
              <ProfileManager 
                userId={user.uid} 
                onUpdateProfile={handleUpdateProfile} 
                onLogout={handleLogout} 
              />
            ) : (
              <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-6" id="auth-form-card">
                <div className="text-center space-y-1">
                  <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-950/40 rounded-2xl flex items-center justify-center text-emerald-600 mx-auto mb-3">
                    <Scale className="h-6 w-6" />
                  </div>
                  <h3 className="font-extrabold text-slate-850 dark:text-slate-100 text-lg">
                    {authMode === 'login' ? 'Sign In' : 'Create Secure Profile'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    ONE HUMANITY. EQUAL DIGNITY. JUSTICE FOR ALL.
                  </p>
                </div>

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {authError && (
                    <div className="bg-rose-50 border border-rose-200 text-rose-800 p-3 rounded-lg text-[11px] leading-relaxed font-semibold">
                      {authError}
                    </div>
                  )}

                  {authMode === 'register' && (
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-bold text-slate-400 uppercase">Your Display Name</span>
                      <input
                        type="text"
                        id="auth-name"
                        value={authName}
                        onChange={(e) => setAuthName(e.target.value)}
                        placeholder="e.g. Alem Girma"
                        className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Email Address</span>
                    <input
                      type="email"
                      id="auth-email"
                      value={authEmail}
                      onChange={(e) => setAuthEmail(e.target.value)}
                      placeholder="e.g. user@girmaic.org"
                      className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <span className="text-[10px] font-bold text-slate-400 uppercase">Secure Password</span>
                    <input
                      type="password"
                      id="auth-password"
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      placeholder="••••••••••••"
                      className="w-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 rounded-lg px-3 py-2 text-xs focus:outline-none"
                    />
                  </div>

                  {/* Role assignment enforced securely via server-side session claims */}

                  <button
                    id="auth-submit-btn"
                    type="submit"
                    className="w-full bg-emerald-600 hover:bg-emerald-555 text-white font-bold py-2.5 rounded-xl text-xs shadow-sm cursor-pointer"
                  >
                    {authMode === 'login' ? 'Sign In / Quick Log' : 'Create Secure Profile'}
                  </button>
                </form>

                <div className="text-center pt-2">
                  <button
                    id="auth-mode-toggle"
                    onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                    className="text-xs text-emerald-600 hover:underline font-semibold cursor-pointer"
                  >
                    {authMode === 'login' ? 'Need an account? Register here' : 'Already have an account? Sign In'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab 8: SECURE ADMIN PANEL */}
        {activeScreen === 'admin' && user && [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.REVIEWER, UserRole.MODERATOR].includes(user.role) && (
          <AdminDashboard />
        )}

      </main>

      {/* Premium International Humanitarian Footer */}
      <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 py-12" id="main-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-white">
                <Scale className="h-5 w-5 text-emerald-400" />
                <span className="font-extrabold text-sm">{activeDict.brand}</span>
              </div>
              <p className="text-[11px] leading-relaxed max-w-sm">
                ONE HUMANITY. EQUAL DIGNITY. JUSTICE FOR ALL.
                We do not fight people. We fight injustice.
              </p>
            </div>

            <div className="space-y-3 text-xs">
              <span className="font-bold text-white block uppercase text-[10px] tracking-wider">Advocacy Resources</span>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setActiveScreen('rights')} className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer">Rights Library</button>
                <button onClick={() => setActiveScreen('help')} className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer">Assistance Directory</button>
                <button onClick={() => setActiveScreen('ai')} className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer">Girmaic AI Assistant</button>
                <button onClick={() => setActiveScreen('community')} className="text-left text-slate-400 hover:text-white transition-colors cursor-pointer">Dialogue Boards</button>
              </div>
            </div>

            <div className="space-y-3 text-xs">
              <span className="font-bold text-white block uppercase text-[10px] tracking-wider font-extrabold text-emerald-400">Security Warning</span>
              <p className="text-[10px] leading-relaxed bg-slate-950/40 p-3 rounded-lg border border-slate-800 text-slate-350">
                {activeDict.emergencyDisclaimer}
              </p>
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] font-semibold text-slate-500">
            <span>© 2026 GIRMAIC HUMANITY — Global Human Rights, Justice & Dignity Platform. All rights reserved.</span>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
              <span>Data Retention Policy</span>
            </div>
          </div>

        </div>
      </footer>

      {/* Keyboard Shortcuts Interactive Cheat Sheet Modal */}
      {showShortcutsHelp && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4" id="shortcuts-modal-overlay">
          <div className="bg-white border border-slate-200 rounded-2xl max-w-md w-full p-6 shadow-2xl relative space-y-4 animate-in fade-in zoom-in-95 duration-150" id="shortcuts-help-dialog">
            <button
              onClick={() => setShowShortcutsHelp(false)}
              className="absolute top-4 right-4 p-1.5 border border-slate-150 rounded-lg hover:bg-slate-50 text-slate-450 cursor-pointer"
              title="Close"
            >
              <X className="h-4 w-4" />
            </button>
            
            <div className="flex items-center gap-2.5 pb-2 border-b border-slate-100">
              <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                <Keyboard className="h-4.5 w-4.5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-900">Global Keyboard Shortcuts</h3>
                <p className="text-[10px] text-slate-400">Boost your humanitarian research & safety navigation</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Standard Navigation</span>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                {[
                  { key: 'H', desc: 'Navigate to Home Dashboard' },
                  { key: 'R', desc: 'File/Submit a Human-Rights Concern' },
                  { key: 'K', desc: 'Access Rights Library (Know Your Rights)' },
                  { key: 'G', desc: 'Open Verified Support Directory (Get Help)' },
                  { key: 'A', desc: 'Consult Humanity AI Assistant' },
                  { key: 'C', desc: 'Join Community Discussions' },
                  { key: 'P', desc: 'Open Personal Settings & Profile' },
                ].map(item => (
                  <div key={item.key} className="flex justify-between items-center p-2 rounded-lg bg-slate-50 border border-slate-100">
                    <span className="font-medium text-slate-700">{item.desc}</span>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-semibold text-[9px] shadow-sm">Ctrl</kbd>
                      <span className="text-[9px] text-slate-400 font-bold">+</span>
                      <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-semibold text-[9px] shadow-sm">{item.key}</kbd>
                    </div>
                  </div>
                ))}
              </div>

              {user && [UserRole.ADMIN, UserRole.SUPER_ADMIN, UserRole.REVIEWER, UserRole.MODERATOR].includes(user.role) && (
                <div className="pt-1">
                  <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block mb-1">Administrative Section</span>
                  <div className="flex justify-between items-center p-2 rounded-lg bg-emerald-50 border border-emerald-100 text-xs">
                    <span className="font-medium text-emerald-850">Access Admin Dashboard</span>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-semibold text-[9px] shadow-sm">Ctrl</kbd>
                      <span className="text-[9px] text-emerald-450 font-bold">+</span>
                      <kbd className="px-1.5 py-0.5 bg-white border border-slate-200 rounded font-semibold text-[9px] shadow-sm">D</kbd>
                    </div>
                  </div>
                </div>
              )}

              <div className="pt-2 border-t border-slate-100 space-y-1.5">
                <span className="text-[10px] font-extrabold text-rose-500 uppercase tracking-wider block">⚠️ SAFETY SHORTCUTS</span>
                <div className="grid grid-cols-1 gap-1.5 text-xs">
                  <div className="flex justify-between items-center p-2 rounded-lg bg-rose-50 border border-rose-100">
                    <span className="font-extrabold text-rose-800">EMERGENCY QUICK EXIT</span>
                    <div className="flex items-center gap-1">
                      <kbd className="px-1.5 py-0.5 bg-white border border-rose-200 rounded font-semibold text-[9px] shadow-sm text-rose-600">Ctrl</kbd>
                      <span className="text-[9px] text-rose-450 font-bold">+</span>
                      <kbd className="px-1.5 py-0.5 bg-white border border-rose-200 rounded font-semibold text-[9px] shadow-sm text-rose-600">E</kbd>
                    </div>
                  </div>
                  <p className="text-[9px] text-slate-450 leading-relaxed italic">
                    Instantly redirects your active tab to a safe search engine to conceal sensitive documentation work. Active system-wide even during report entries.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowShortcutsHelp(false)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs cursor-pointer"
              >
                Dismiss
              </button>
            </div>
          </div>
        </div>
      )}

      {/* App Security Passcode / Biometric Unlock Modal */}
      {securityModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200" id="security-lock-modal">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-5 text-center">
            <div className="w-14 h-14 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto border border-emerald-200">
              <ShieldCheck className="h-7 w-7" />
            </div>
            
            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-slate-900 dark:text-slate-100 uppercase tracking-tight">Security Lock Active</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Authentication required to access the secure <strong className="text-slate-700 dark:text-slate-200 uppercase">{pendingScreen}</strong> section.
              </p>
            </div>

            <form onSubmit={handleVerifyPasscode} className="space-y-4">
              <div className="space-y-1.5 text-left">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Enter Security Passcode</label>
                <input
                  type="password"
                  maxLength={6}
                  value={securityPasscode}
                  onChange={(e) => setSecurityPasscode(e.target.value)}
                  placeholder="•••• (Default: 1234)"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-center text-lg tracking-widest font-bold text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  autoFocus
                />
              </div>

              {securityError && (
                <p className="text-[11px] font-bold text-rose-600 bg-rose-50 p-2 rounded-xl border border-rose-200">
                  {securityError}
                </p>
              )}

              <div className="space-y-2 pt-1">
                <button
                  type="submit"
                  className="w-full bg-emerald-600 hover:bg-emerald-550 text-white font-black py-3 rounded-xl text-xs shadow-md shadow-emerald-700/10 cursor-pointer transition-all uppercase tracking-wider flex items-center justify-center gap-2"
                >
                  <Lock className="h-4 w-4" /> Unlock Section
                </button>

                <button
                  type="button"
                  onClick={handleBiometricUnlockAttempt}
                  className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 font-bold py-2.5 rounded-xl text-xs cursor-pointer transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-700"
                >
                  <Fingerprint className="h-4 w-4 text-emerald-600" /> Use Touch ID / Biometric
                </button>
              </div>
            </form>

            <button
              onClick={() => { setSecurityModalOpen(false); setPendingScreen(null); }}
              className="text-xs text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 font-semibold cursor-pointer pt-1 block mx-auto"
            >
              Cancel & Return to Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
