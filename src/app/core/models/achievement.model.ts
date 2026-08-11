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
  problemSolvingScore?: number;
  category?: 'mock' | 'practice' | 'real';
  technologyScores?: { topic: string; score: number }[];
  categoryScores?: { category: string; score: number }[];
  detailedQuestionScores?: any[];
  summaryFeedback: string;
  strengths: string[];
  improvementAreas: string[];
  recommendedTopics: string[];
  shareToken: string;
}

export interface LearnerProgressReportData {
  userName: string;
  userEmail: string;
  targetRole: string;
  userPlan: string;
  level: number;
  levelTitle: string;
  totalXp: number;
  currentStreak: number;
  quizCompletedCount: number;
  interviewCompletedCount: number;
  skillsRatedCount: number;
  unlockedBadgesCount: number;
  topicScores?: { topic: string; score: number; status: string }[];
  recentInterviews?: { date: string; role: string; score: number; category?: string; feedback: string }[];
  strengths?: string[];
  improvementAreas?: string[];
  recommendedFocusTopics?: string[];
}

