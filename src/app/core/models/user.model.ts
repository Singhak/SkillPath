export interface User {
  id: string;
  name: string;
  email: string;
  coins?: number;
  totalQuizAttempted?: number;
  freeCredits?: string;
  lastCreditReset?: string | Date;
  paidCredits?: string;
  bio?: string;
  targetRole?: string;
  phone?: string;
  location?: string;
  skills?: string[];
  aiDifficulty?: 'beginner' | 'intermediate' | 'advanced';
  emailNotifications?: boolean;
  memberSince?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
