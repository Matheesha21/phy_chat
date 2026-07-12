import { httpClient } from './httpClient';

export interface AuthUser {
  id: number;
  google_sub: string;
  email: string;
  full_name: string | null;
  picture_url: string | null;
  is_active: boolean;
  has_completed_competition_onboarding: boolean;
}

interface AuthResponse {
  user: AuthUser;
  session_expires_at: string;
}

export const authService = {
  signInWithGoogle: (idToken: string): Promise<AuthResponse> =>
    httpClient.post<AuthResponse>('/auth/google', { id_token: idToken }),

  logout: (): Promise<{ message: string }> => httpClient.post('/auth/logout'),

  getCurrentUser: (): Promise<AuthUser> => httpClient.get<AuthUser>('/auth/me')
};
