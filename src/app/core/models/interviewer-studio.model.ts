export type ExperienceLevel = 'Junior (0-2 Yrs)' | 'Mid-Level (2-5 Yrs)' | 'Senior (5-8 Yrs)' | 'Staff / Lead (8+ Yrs)';
export type InterviewRoundType = 'Screening (30 Min)' | 'Deep Technical (60 Min)' | 'System Design & Architecture (60 Min)' | 'Behavioral & Leadership (45 Min)';
export type QuestionDifficulty = 'Easy' | 'Medium' | 'Hard';
export type QuestionCategory = 'Conceptual' | 'CodingSnippet' | 'ScenarioBased' | 'Architecture' | 'BehavioralSTAR';

export interface TechWeightConfig {
  name: string;
  weightPercentage: number;
  questionCount: number;
}

export interface InterviewRequirementConfig {
  jobTitle: string;
  candidateName: string;
  experienceLevel: ExperienceLevel;
  roundType: InterviewRoundType;
  totalDurationMinutes: number;
  technologies: TechWeightConfig[];
  difficultyDistribution: {
    easyPercentage: number;
    mediumPercentage: number;
    hardPercentage: number;
  };
  customNotes?: string;
}

export interface RubricItem {
  id: string;
  title: string;
  keywords: string[];
  checked: boolean;
  scoreWeight: number;
}

export interface AdaptiveProbes {
  levelUpProbe: string; // Used when candidate answers effortlessly
  simplifyingHint: string; // Used when candidate is stuck
  redFlags: string[]; // Key warning signs of shallow understanding
}

export interface InterviewQuestionItem {
  id: string;
  technology: string;
  category: QuestionCategory;
  difficulty: QuestionDifficulty;
  estimatedMinutes: number;
  questionText: string;
  contextOrCodeSnippet?: string;
  idealAnswerSummary: string;
  rubricItems: RubricItem[];
  probes: AdaptiveProbes;
  interviewerRating?: {
    score: number; // 1 to 5
    notes: string;
    completedAt?: string;
  };
}

export interface InterviewSessionMatrix {
  id: string;
  config: InterviewRequirementConfig;
  questions: InterviewQuestionItem[];
  startedAt?: string;
  endedAt?: string;
  overallScore?: number;
  recommendation?: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'No Hire';
}

export interface TeamTemplate {
  id: string;
  title: string;
  description: string;
  role: string;
  experienceLevel: ExperienceLevel;
  roundType: InterviewRoundType;
  technologies: TechWeightConfig[];
  tags: string[];
}

export interface CandidateAssessmentReport {
  sessionId: string;
  candidateName: string;
  jobTitle: string;
  experienceLevel: string;
  roundType: string;
  date: string;
  startTimeFormatted?: string;
  durationFormatted?: string;
  overallScore: number;
  recommendation: 'Strong Hire' | 'Hire' | 'Lean Hire' | 'No Hire';
  summaryFeedback: string;
  strengths: string[];
  areasForImprovement: string[];
  technologyScores: Array<{
    techName: string;
    score: number; // 0-100
    questionsEvaluated: number;
  }>;
  categoryScores: Array<{
    category: string;
    score: number;
  }>;
  detailedQuestionScores: Array<{
    questionText: string;
    technology: string;
    score: number;
    notes: string;
    rubricMatchCount: number;
    totalRubricCount: number;
  }>;
}
