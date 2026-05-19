import { api } from './client';
import type { Me, Tokens, UserRole } from '@/types';

export type RegisterInput = {
  email: string;
  password: string;
  role: Extract<UserRole, 'patient' | 'doctor'>;
  firstName: string;
  lastName: string;
  fiscalCode?: string;
  specialization?: string;
  licenseNumber?: string;
};

export const authApi = {
  register(input: RegisterInput) {
    return api.post<Tokens>('/auth/register', input).then((r) => r.data);
  },
  login(email: string, password: string) {
    return api.post<Tokens>('/auth/login', { email, password }).then((r) => r.data);
  },
  refresh(refreshToken: string) {
    return api.post<Tokens>('/auth/refresh', { refreshToken }).then((r) => r.data);
  },
  logout(refreshToken?: string) {
    return api.post('/auth/logout', { refreshToken }).then(() => undefined);
  },
  me() {
    return api.get<Me>('/users/me').then((r) => r.data);
  },
};
