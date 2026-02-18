import { apiClient } from '../../../shared/utils/apiClient';
import { type AuthResponse, type ApiResponse } from '../../../shared/types/api.types';

export const authService = {
  async register(data: {
    email: string;
    password: string;
    displayName?: string;
  }): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/register',
      data
    );
    return response.data!;
  },

  async login(data: { email: string; password: string }): Promise<AuthResponse> {
    const response = await apiClient.post<ApiResponse<AuthResponse>>(
      '/auth/login',
      data
    );
    return response.data!;
  },

  logout(): void {
    apiClient.clearToken();
  },

  isAuthenticated(): boolean {
    return !!apiClient.getToken();
  },

  getToken(): string | null {
    return apiClient.getToken();
  },

  setToken(token: string): void {
    apiClient.setToken(token);
  },
};