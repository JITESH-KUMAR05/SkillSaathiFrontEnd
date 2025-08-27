import apiClient from '@/lib/api';
import { AuthResponse, LoginRequest, RegisterRequest, User } from '@/types';

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    const response = await apiClient.post('/auth/login', credentials);
    // Backend returns {access_token, token_type}; we then fetch profile
    const tokenData = response.data;
    const authResp: AuthResponse = {
      access_token: tokenData.access_token,
      token_type: tokenData.token_type || 'bearer',
      user: await (async () => {
        // Temporarily set token header for following call
        localStorage.setItem('access_token', tokenData.access_token);
        const profile = await this.getCurrentUser();
        return profile;
      })(),
    };
    return authResp;
  },

  async register(userData: RegisterRequest): Promise<AuthResponse> {
    await apiClient.post('/auth/register', userData);
    // Auto-login after registration
    return this.login({ email: userData.email, password: userData.password });
  },

  async getCurrentUser(): Promise<User> {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  async logout(): Promise<void> {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
  },

  saveToken(token: string): void {
    localStorage.setItem('access_token', token);
  },

  getToken(): string | null {
    return localStorage.getItem('access_token');
  },

  saveUser(user: User): void {
    localStorage.setItem('user', JSON.stringify(user));
  },

  getUser(): User | null {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  },

  isAuthenticated(): boolean {
    return !!this.getToken();
  },
};
