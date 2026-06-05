import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useAuthStore } from './auth';
import { useActingAsStore } from './acting-as';

const ACTING_KEY = 'panacea.actingAs';

describe('auth store / acting-as isolation', () => {
  beforeEach(() => {
    sessionStorage.clear();
    setActivePinia(createPinia());
  });

  it('clear() also wipes the acting-as session', () => {
    const acting = useActingAsStore();
    acting.actAs({ delegatorUserId: 'D', name: 'Delegante' });

    useAuthStore().clear();

    expect(acting.isActing).toBe(false);
    expect(sessionStorage.getItem(ACTING_KEY)).toBeNull();
  });

  it('setTokens() drops a stale acting-as from a previous session on the same tab', () => {
    const acting = useActingAsStore();
    acting.actAs({ delegatorUserId: 'D', name: 'Delegante' });

    useAuthStore().setTokens({
      accessToken: 'a.b.c',
      refreshToken: 'r',
      accessExpiresAt: '2026-01-01T00:00:00.000Z',
      refreshExpiresAt: '2026-01-08T00:00:00.000Z',
    });

    expect(acting.isActing).toBe(false);
    expect(sessionStorage.getItem(ACTING_KEY)).toBeNull();
  });
});
