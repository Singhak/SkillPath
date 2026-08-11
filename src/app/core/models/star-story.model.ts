export interface StarStory {
  id: string;
  storyId?: number;
  customId?: string;
  title: string;
  competency: string;
  situation: string;
  task: string;
  action: string;
  result: string;
  tags: string[];
  impactScore: number; // 0 - 100
  createdAt?: string;
  updatedAt?: string;
}

export const DEFAULT_COMPETENCY_CATEGORIES = [
  'Conflict Resolution',
  'Leadership',
  'Technical Failure',
  'Problem Solving',
  'Team Collaboration',
  'System Architecture',
  'Performance Tuning',
  'Project Management',
  'Cross-Functional Communication',
  'Mentorship & Coaching',
];
