/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Report, UserProfile, CommunityPost, UserRole, ReportStatus, PrivacyLevel } from '../types';

// Simple in-memory fallback state in case localStorage is unavailable
class SecureLocalDb {
  private getStorageItem<T>(key: string, defaultValue: T): T {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch {
      return defaultValue;
    }
  }

  private setStorageItem<T>(key: string, value: T): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn('LocalStorage write failed:', e);
    }
  }

  getUsers(): UserProfile[] {
    const defaultUsers: UserProfile[] = [
      {
        uid: 'demo-admin',
        displayName: 'Alem Girma',
        email: 'admin@girmaic.org',
        role: UserRole.SUPER_ADMIN,
        language: 'en',
        createdAt: new Date().toISOString(),
        notificationPreferences: { email: true, reports: true, educational: true },
        accessibilitySettings: { largeText: false, highContrast: false, reducedMotion: false },
        privacySettings: { shareAggregated: true, allowReviewerChat: true }
      },
      {
        uid: 'demo-reviewer',
        displayName: 'Sarah Johnson',
        email: 'reviewer@girmaic.org',
        role: UserRole.REVIEWER,
        language: 'en',
        createdAt: new Date().toISOString(),
        notificationPreferences: { email: true, reports: true, educational: true },
        accessibilitySettings: { largeText: false, highContrast: false, reducedMotion: false },
        privacySettings: { shareAggregated: true, allowReviewerChat: true }
      }
    ];
    return this.getStorageItem<UserProfile[]>('girmaic_users', defaultUsers);
  }

  saveUser(user: UserProfile): void {
    const users = this.getUsers();
    const index = users.findIndex(u => u.uid === user.uid);
    if (index >= 0) {
      users[index] = user;
    } else {
      users.push(user);
    }
    this.setStorageItem('girmaic_users', users);
  }

  getReports(): Report[] {
    const defaultReports: Report[] = [
      {
        id: 'HR-2026-000124',
        userId: 'demo-user',
        categories: ['discrimination', 'marginalization'],
        description: 'Members of our local community were excluded from entering the administrative town council hall to discuss land redistribution resources.',
        dateOfIncident: '2026-08-10',
        locationOfIncident: {
          country: 'Ethiopia',
          region: 'Oromia',
          city: 'Adama'
        },
        relationship: 'witness',
        evidence: [
          {
            id: 'ev-1',
            name: 'exclusion_letter.pdf',
            size: 452000,
            type: 'application/pdf',
            uploadedAt: '2026-08-12T10:00:00Z',
            safeUrl: '#',
            isMalwareChecked: true,
            metadataMinimized: true
          }
        ],
        additionalInfo: 'There were about 15 families directly blocked at the gate.',
        privacyLevel: PrivacyLevel.CONFIDENTIAL, // CONFIDENTIAL
        status: ReportStatus.SAFETY_REVIEW,
        createdAt: '2026-08-12T10:05:00Z',
        updatedAt: '2026-08-12T10:15:00Z',
        aiSuggestedCategory: 'Marginalization',
        aiConfidence: 0.94,
        aiReason: 'Describes the systematic exclusion of a group from municipal dialogue and resources based on demographic and identity boundaries.',
        aiSafetyFlags: [],
        humanReviewed: false,
        timeline: [
          {
            id: 't-1',
            status: ReportStatus.SUBMITTED,
            changedBy: 'System',
            timestamp: '2026-08-12T10:05:00Z',
            notes: 'Report successfully lodged securely.'
          },
          {
            id: 't-2',
            status: ReportStatus.SAFETY_REVIEW,
            changedBy: 'Girmaic AI Engine',
            timestamp: '2026-08-12T10:05:10Z',
            notes: 'AI Safety scanner has completed analysis. Categorized as High Relevance, no personal addresses exposed.'
          }
        ],
        reviews: []
      },
      {
        id: 'HR-2026-000125',
        userId: 'demo-user',
        categories: ['police_brutality', 'human_rights_violations'],
        description: 'Excessive use of force by regional safety officers to clear a peaceful gathering of human rights students near the library.',
        dateOfIncident: '2026-08-15',
        locationOfIncident: {
          country: 'Kenya',
          region: 'Nairobi',
          city: 'Nairobi Central'
        },
        relationship: 'affected',
        evidence: [
          {
            id: 'ev-2',
            name: 'video_clip.mp4',
            size: 8900000,
            type: 'video/mp4',
            uploadedAt: '2026-08-16T14:30:00Z',
            safeUrl: '#',
            isMalwareChecked: true,
            metadataMinimized: true
          }
        ],
        privacyLevel: PrivacyLevel.RESTRICTED_REVIEW, // RESTRICTED REVIEW
        status: ReportStatus.VERIFIED,
        createdAt: '2026-08-16T14:32:00Z',
        updatedAt: '2026-08-20T09:00:00Z',
        aiSuggestedCategory: 'Police Brutality',
        aiConfidence: 0.98,
        aiReason: 'Direct allegation of excessive physical force used by state law enforcement personnel against peaceful educational assembly.',
        aiSafetyFlags: [],
        humanReviewed: true,
        finalCategory: 'Police Brutality',
        timeline: [
          {
            id: 't-1',
            status: ReportStatus.SUBMITTED,
            changedBy: 'System',
            timestamp: '2026-08-16T14:32:00Z',
            notes: 'Report lodged securely.'
          },
          {
            id: 't-2',
            status: ReportStatus.VERIFIED,
            changedBy: 'Sarah Johnson (Reviewer)',
            timestamp: '2026-08-20T09:00:00Z',
            notes: 'Corroborated with public news sources and verified by our regional human rights analyst. Legal aid support assigned.'
          }
        ],
        reviews: [
          {
            reviewer: 'Sarah Johnson',
            reviewDate: '2026-08-20',
            reviewNotes: 'The video clearly validates excessive measures used. Coordinated with Nairobi legal assistance teams.',
            evidenceConsidered: ['video_clip.mp4'],
            decision: 'Verified and referred to Amnesty Kenya partners',
            decisionStatus: ReportStatus.VERIFIED
          }
        ]
      }
    ];
    return this.getStorageItem<Report[]>('girmaic_reports', defaultReports);
  }

  saveReport(report: Report): void {
    const reports = this.getReports();
    const index = reports.findIndex(r => r.id === report.id);
    if (index >= 0) {
      reports[index] = report;
    } else {
      reports.push(report);
    }
    this.setStorageItem('girmaic_reports', reports);
  }

  getCommunityPosts(): CommunityPost[] {
    const defaultPosts: CommunityPost[] = [
      {
        id: 'p-1',
        userId: 'demo-user-1',
        userDisplayName: 'Tadesse K.',
        userRole: UserRole.VERIFIED_CONTRIBUTOR,
        category: 'Education',
        title: 'Teaching kids about human rights in schools',
        content: 'We organized a beautiful workshop in our local youth club using the Universal Declaration of Human Rights. Children are extremely receptive to the core principle of equal dignity. Education is the greatest shield against future injustice.',
        createdAt: '2026-08-25T11:00:00Z',
        likes: 24,
        flags: 0,
        isFlagged: false
      },
      {
        id: 'p-2',
        userId: 'demo-user-2',
        userDisplayName: 'Fatuma S.',
        userRole: UserRole.USER,
        category: 'Peaceful Advocacy',
        title: 'Letter writing campaign for arbitrary arrest cases',
        content: 'Does anyone have a clean, respectful template for drafting letters to regional ombudsmen regarding fast-tracking trials? I want to make sure we use completely lawful, peaceful civic action to support prisoners who have been waiting in pre-trial detention for months.',
        createdAt: '2026-08-26T15:30:00Z',
        likes: 18,
        flags: 0,
        isFlagged: false
      }
    ];
    return this.getStorageItem<CommunityPost[]>('girmaic_posts', defaultPosts);
  }

  saveCommunityPost(post: CommunityPost): void {
    const posts = this.getCommunityPosts();
    const index = posts.findIndex(p => p.id === post.id);
    if (index >= 0) {
      posts[index] = post;
    } else {
      posts.push(post);
    }
    this.setStorageItem('girmaic_posts', posts);
  }

  getBookmarks(): string[] {
    return this.getStorageItem<string[]>('girmaic_bookmarks', []);
  }

  saveBookmark(id: string): void {
    const bookmarks = this.getBookmarks();
    if (!bookmarks.includes(id)) {
      bookmarks.push(id);
      this.setStorageItem('girmaic_bookmarks', bookmarks);
    }
  }

  removeBookmark(id: string): void {
    const bookmarks = this.getBookmarks();
    const index = bookmarks.indexOf(id);
    if (index >= 0) {
      bookmarks.splice(index, 1);
      this.setStorageItem('girmaic_bookmarks', bookmarks);
    }
  }
}

export const localDb = new SecureLocalDb();
