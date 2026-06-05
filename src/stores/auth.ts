import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import type { AuthenticatedUser, Tokens, UserRole } from '@/types';
import { tokenStorage } from '@/lib/token-storage';
import { useActingAsStore } from '@/stores/acting-as';

export const useAuthStore = defineStore('auth', () => {
  const accessToken = ref<string | null>(null);
  const user = ref<AuthenticatedUser | null>(null);

  const isAuthenticated = computed(() => Boolean(accessToken.value));
  const role = computed<UserRole | null>(() => user.value?.role ?? null);

  function setTokens(tokens: Tokens) {
    // Establishing a new identity must never inherit a previous user's acting-as session
    // (sessionStorage survives across logins on the same tab).
    useActingAsStore().clear();
    accessToken.value = tokens.accessToken;
    tokenStorage.setRefresh(tokens.refreshToken);
    user.value = decodeUserFromAccess(tokens.accessToken);
  }

  function setUser(u: AuthenticatedUser) {
    user.value = u;
  }

  function clear() {
    // Tearing down the identity (logout, failed refresh) must also drop any acting-as session
    // so the next user on this tab cannot inherit it.
    useActingAsStore().clear();
    accessToken.value = null;
    user.value = null;
    tokenStorage.clearRefresh();
  }

  return { accessToken, user, isAuthenticated, role, setTokens, setUser, clear };
});

function decodeUserFromAccess(token: string): AuthenticatedUser | null {
  try {
    const [, payload] = token.split('.');
    if (!payload) return null;
    const json = JSON.parse(
      atob(payload.replace(/-/g, '+').replace(/_/g, '/')),
    ) as { sub?: string; email?: string; role?: UserRole };
    if (!json.sub || !json.email || !json.role) return null;
    return { id: json.sub, email: json.email, role: json.role };
  } catch {
    return null;
  }
}
