import api from './axios';
import type { User } from '@/types/user.types';
import type { LoginCredentials, RegisterData } from '@/types/auth.types';

// The backend will return the user and a token
interface AuthResponse {
  user: User;
  token: string;
}

/**
 * Login user.
 * Laravel endpoint: POST /api/v1/login
 */
export const login = async (credentials: LoginCredentials): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/login', credentials);
  return response.data;
};

/**
 * Register new user.
 * Laravel endpoint: POST /api/v1/register
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>('/register', data);
  return response.data;
};

/**
 * Logout user.
 * Note: The backend needs a route like this, protected by sanctum middleware.
 * Laravel endpoint: POST /api/v1/logout
 */
export const logout = async (): Promise<void> => {
  await api.post('/logout');
};

/**
 * Get current authenticated user using the token.
 * Laravel endpoint: GET /api/v1/user
 */
export const getAuthenticatedUser = async (): Promise<User> => {
    // We need to ensure the token is sent with this request.
    // The axios instance in 'axios.ts' should have an interceptor for this.
    const response = await api.get<User>('/user');
    return response.data;
};

/**
 * Get CSRF cookie for Laravel Sanctum.
 * This is crucial for Sanctum's SPA authentication to work.
 */
export const getCsrfCookie = async (): Promise<void> => {
  await api.get('/sanctum/csrf-cookie', {
    baseURL: import.meta.env.VITE_API_URL?.replace('/api/v1', '') || 'http://localhost:8000',
  });
};