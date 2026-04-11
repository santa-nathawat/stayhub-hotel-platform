import api from './client';
import type { User } from '../types';

interface AuthResponse {
  user: User;
  accessToken: string;
  refreshToken: string;
}

export async function registerUser(data: {
  name: string;
  email: string;
  password: string;
  role: 'GUEST' | 'PARTNER';
}): Promise<AuthResponse> {
  const res = await api.post('/auth/register', data);
  return res.data;
}

export async function loginUser(data: {
  email: string;
  password: string;
}): Promise<AuthResponse> {
  const res = await api.post('/auth/login', data);
  return res.data;
}

export async function getMe(): Promise<User> {
  const res = await api.get('/auth/me');
  return res.data;
}

export async function refreshTokens(refreshToken: string) {
  const res = await api.post('/auth/refresh', { refreshToken });
  return res.data;
}
