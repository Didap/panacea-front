import { beforeEach, describe, expect, it } from 'vitest';
import { createPinia, setActivePinia } from 'pinia';
import { useActingAsStore } from './acting-as';

const KEY = 'panacea.actingAs';

describe('acting-as store', () => {
  beforeEach(() => {
    sessionStorage.clear();
    setActivePinia(createPinia());
  });

  it('starts empty', () => {
    const store = useActingAsStore();
    expect(store.isActing).toBe(false);
    expect(store.party).toBeNull();
  });

  it('actAs sets the party and persists it', () => {
    const store = useActingAsStore();
    store.actAs({ delegatorUserId: 'u1', name: 'Maria Rossi' });

    expect(store.isActing).toBe(true);
    expect(store.party).toEqual({ delegatorUserId: 'u1', name: 'Maria Rossi' });
    expect(JSON.parse(sessionStorage.getItem(KEY) ?? 'null')).toEqual({
      delegatorUserId: 'u1',
      name: 'Maria Rossi',
    });
  });

  it('clear resets the party and removes persistence', () => {
    const store = useActingAsStore();
    store.actAs({ delegatorUserId: 'u1', name: 'Maria Rossi' });
    store.clear();

    expect(store.isActing).toBe(false);
    expect(store.party).toBeNull();
    expect(sessionStorage.getItem(KEY)).toBeNull();
  });

  it('hydrates from sessionStorage on init', () => {
    sessionStorage.setItem(KEY, JSON.stringify({ delegatorUserId: 'u9', name: 'Nonna Bianchi' }));
    setActivePinia(createPinia());

    const store = useActingAsStore();
    expect(store.party).toEqual({ delegatorUserId: 'u9', name: 'Nonna Bianchi' });
  });
});
