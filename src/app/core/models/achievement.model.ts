export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'streak' | 'quiz' | 'interview' | 'skill' | 'mastery';
  icon: string;
  badgeClass: string;
  requiredCount: number;
  currentProgress: number;
  isUnlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export interface UserGamificationStats {
  currentStreak: number;
  longestStreak: number;
  xpPoints: number;
  level: number;
  levelTitle: string;
  xpToNextLevel: number;
  xpCurrentLevelProgress: number; // percentage 0 - 100
  totalBadgesUnlocked: number;
  totalBadgesAvailable: number;
  lastActivityDate?: string;
}

export interface InterviewReportData {
  reportId: string;
  sessionId: string;
  userName: string;
  userEmail: string;
  roleOrSkill: string;
  date: string;
  overallScore: number;
  technicalAccuracyScore: number;
  communicationScore: number;
  confidenceScore: number;
  summaryFeedback: string;
  strengths: string[];
  improvementAreas: string[];
  recommendedTopics: string[];
  shareToken: string;
}
