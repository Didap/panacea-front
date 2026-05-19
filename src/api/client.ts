import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '@/stores/auth';
import { tokenStorage } from '@/lib/token-storage';

const baseURL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1';

export const api = axios.create({ baseURL, withCredentials: false });

api.interceptors.request.use((config) => {
  const auth = useAuthStore();
  if (auth.accessToken) {
    config.headers.set('Authorization', `Bearer ${auth.accessToken}`);
  }
  return config;
});

let refreshing: Promise<string> | null = null;

api.interceptors.response.use(
  (r) => r,
  async (error: AxiosError) => {
    const status = error.response?.status;
    const original = error.config as InternalAxiosRequestConfig & { _retried?: boolean };
    const auth = useAuthStore();

    if (status !== 401 || original._retried || original.url?.includes('/auth/')) {
      return Promise.reject(error);
    }

    const refresh = tokenStorage.getRefresh();
    if (!refresh) {
      auth.clear();
      return Promise.reject(error);
    }

    refreshing ??= performRefresh(refresh).finally(() => {
      refreshing = null;
    });

    try {
      const newAccess = await refreshing;
      original._retried = true;
      original.headers ??= {} as InternalAxiosRequestConfig['headers'];
      original.headers.Authorization = `Bearer ${newAccess}`;
      return api.request(original);
    } catch (e) {
      auth.clear();
      return Promise.reject(e);
    }
  },
);

async function performRefresh(refreshToken: string): Promise<string> {
  const res = await axios.post(
    `${baseURL}/auth/refresh`,
    { refreshToken },
    { withCredentials: false },
  );
  const auth = useAuthStore();
  auth.setTokens(res.data);
  tokenStorage.setRefresh(res.data.refreshToken);
  return res.data.accessToken;
}
