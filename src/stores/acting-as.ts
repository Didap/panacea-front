import { defineStore } from 'pinia';
import { computed, ref } from 'vue';

export type ActingAsParty = {
  delegatorUserId: string;
  name: string;
};

const STORAGE_KEY = 'panacea.actingAs';

function load(): ActingAsParty | null {
  const raw = sessionStorage.getItem(STORAGE_KEY);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as ActingAsParty;
  } catch {
    return null;
  }
}

// Holds the data owner the delegate is currently operating on behalf of. Persisted in
// sessionStorage so the "Operi per conto di X" banner survives a reload.
export const useActingAsStore = defineStore('acting-as', () => {
  const party = ref<ActingAsParty | null>(load());

  const isActing = computed(() => party.value !== null);

  function actAs(next: ActingAsParty) {
    party.value = next;
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }

  function clear() {
    party.value = null;
    sessionStorage.removeItem(STORAGE_KEY);
  }

  return { party, isActing, actAs, clear };
});
