export interface User {
  id: string;
  name: string;
  email: string;
  coins?: number;
  totalQuizAttempted?: number;
  freeCredits?: string;
  lastCreditReset?: string | Date;
  paidCredits?: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface RefreshTokenResponse {
  accessToken: string;
}
