import axios, { type AxiosInstance } from 'axios';
import { API_CONFIG } from '../../config/api.config';

class ApiClient {
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: API_CONFIG.BASE_URL,
      timeout: API_CONFIG.TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        config.headers['X-Platform'] = 'web';
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor
    this.client.interceptors.response.use(
      (response) => response.data,
      (error) => {
        if (error.response) {
          const errorData = error.response.data;

          if (errorData?.error?.code === 'TOKEN_EXPIRED') {
            this.clearToken();
            window.location.href = '/login';
          }

          return Promise.reject({
            code: errorData?.error?.code || 'UNKNOWN_ERROR',
            message: errorData?.error?.message || 'An error occurred',
            details: errorData?.error?.details,
          });
        } else if (error.request) {
          return Promise.reject({
            code: 'NETWORK_ERROR',
            message: 'Unable to connect to server',
          });
        }
        return Promise.reject({
          code: 'UNKNOWN_ERROR',
          message: error.message || 'An unexpected error occurred',
        });
      }
    );
  }

  getToken(): string | null {
    return localStorage.getItem('auth_token');
  }

  setToken(token: string): void {
    localStorage.setItem('auth_token', token);
  }

  clearToken(): void {
    localStorage.removeItem('auth_token');
  }

  async get<T>(url: string, config?: any): Promise<T> {
    return this.client.get(url, config);
  }

  async post<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.post(url, data, config);
  }

  async patch<T>(url: string, data?: any, config?: any): Promise<T> {
    return this.client.patch(url, data, config);
  }

  async delete<T>(url: string, config?: any): Promise<T> {
    return this.client.delete(url, config);
  }
}

export const apiClient = new ApiClient();