export interface JobRoleRequirement {
  roleId: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  competencies: {
    skillName: string;
    requiredRating: number; // 1 to 5
  }[];
}

export interface SkillGapItem {
  skillName: string;
  currentRating: number;
  requiredRating: number;
  gapAmount: number; // positive = deficit
  readinessPercentage: number;
  status: 'Mastered' | 'On Track' | 'Needs Practice' | 'Critical Gap';
}

export interface FlashcardQuestion {
  id: string;
  question: string;
  category: string;
  correctAnswer: string;
  explanation: string;
  codeSnippet?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  nextReviewDate: string;
  intervalDays: number;
  repetitionCount: number;
  cardType?: 'standard' | 'cloze';
  clozePrompt?: string;
  clozeAnswer?: string;
  clozeOptions?: string[];
  easeFactor?: number;
  masteryLevel?: number; // 0 to 100%
  lastReviewedDate?: string;
}
