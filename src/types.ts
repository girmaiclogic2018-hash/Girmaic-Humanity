/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export enum UserRole {
  USER = 'USER',
  VERIFIED_CONTRIBUTOR = 'VERIFIED_CONTRIBUTOR',
  REVIEWER = 'REVIEWER',
  MODERATOR = 'MODERATOR',
  ORGANIZATION_REVIEWER = 'ORGANIZATION_REVIEWER',
  HUMAN_RIGHTS_ANALYST = 'HUMAN_RIGHTS_ANALYST',
  ADMIN = 'ADMIN',
  SUPER_ADMIN = 'SUPER_ADMIN'
}

export enum ReportStatus {
  DRAFT = 'DRAFT',
  SUBMITTED = 'SUBMITTED',
  RECEIVED = 'RECEIVED',
  SAFETY_REVIEW = 'SAFETY_REVIEW',
  MODERATION_REVIEW = 'MODERATION_REVIEW',
  VERIFICATION_PENDING = 'VERIFICATION_PENDING',
  CORROBORATED = 'CORROBORATED',
  VERIFIED = 'VERIFIED',
  UNVERIFIED = 'UNVERIFIED',
  DISPUTED = 'DISPUTED',
  REFERRED = 'REFERRED',
  RESOLVED = 'RESOLVED',
  CLOSED = 'CLOSED'
}

export enum PrivacyLevel {
  CONFIDENTIAL = 'CONFIDENTIAL',
  RESTRICTED_REVIEW = 'RESTRICTED_REVIEW',
  ANONYMOUS = 'ANONYMOUS',
  PUBLIC_AGGREGATED = 'PUBLIC_AGGREGATED'
}

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  role: UserRole;
  language: string;
  createdAt: string;
  notificationPreferences: {
    email: boolean;
    reports: boolean;
    educational: boolean;
  };
  accessibilitySettings: {
    largeText: boolean;
    highContrast: boolean;
    reducedMotion: boolean;
  };
  privacySettings: {
    shareAggregated: boolean;
    allowReviewerChat: boolean;
  };
}

export interface ReportCategory {
  id: string;
  name: string;
  description: string;
  educationalExplanation: string;
  examples: string[];
  safetyGuidance: string;
  relatedRights: string[];
  relatedResources: string[];
  multilingual: {
    [key: string]: {
      name: string;
      description: string;
    };
  };
}

export interface EvidenceFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadedAt: string;
  safeUrl?: string;
  isMalwareChecked?: boolean;
  metadataMinimized?: boolean;
}

export interface ReportTimelineEvent {
  id: string;
  status: ReportStatus;
  changedBy: string;
  timestamp: string;
  notes: string;
}

export interface HumanReview {
  reviewer: string;
  reviewDate: string;
  reviewNotes: string;
  evidenceConsidered: string[];
  decision: string;
  decisionStatus: ReportStatus;
}

export interface Report {
  id: string; // HR-YYYY-XXXXXX
  userId: string;
  categories: string[];
  description: string;
  dateOfIncident: string;
  locationOfIncident: {
    country: string;
    region: string;
    city?: string;
  };
  relationship: 'affected' | 'witness' | 'source';
  evidence: EvidenceFile[];
  additionalInfo?: string;
  privacyLevel: PrivacyLevel;
  status: ReportStatus;
  createdAt: string;
  updatedAt: string;
  
  // AI Assisted fields
  aiSuggestedCategory?: string;
  aiConfidence?: number;
  aiReason?: string;
  aiSafetyFlags?: string[];
  humanReviewed: boolean;
  finalCategory?: string;
  
  timeline: ReportTimelineEvent[];
  reviews: HumanReview[];
}

export interface RightsArticle {
  id: string;
  title: string;
  category: string;
  summary: string;
  fullExplanation: string;
  multilingual: {
    [key: string]: {
      title: string;
      summary: string;
      fullExplanation: string;
    };
  };
  source: string;
  sourceUrl?: string;
  jurisdiction: string;
  publicationDate: string;
  lastReviewed: string;
  reviewStatus: 'verified' | 'pending';
}

export interface Organization {
  id: string;
  name: string;
  categories: string[];
  description: string;
  contactEmail?: string;
  website?: string;
  phone?: string;
  emergencyPhone?: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'VERIFIED' | 'SUSPENDED' | 'REJECTED';
  location: string;
}

export interface CommunityPost {
  id: string;
  userId: string;
  userDisplayName: string;
  userRole: UserRole;
  category: string;
  title: string;
  content: string;
  createdAt: string;
  likes: number;
  flags: number;
  isFlagged: boolean;
}

export interface AuditLog {
  id: string;
  actorId: string;
  actorEmail: string;
  action: string;
  targetId: string;
  timestamp: string;
  ipAddress?: string;
}
