<script setup lang="ts">
import { computed } from 'vue';
import { RouterView, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useAuthStore } from '@/stores/auth';
import { authApi } from '@/api/auth.api';
import { tokenStorage } from '@/lib/token-storage';
import { LogOut, Stethoscope, HeartPulse } from 'lucide-vue-next';

const auth = useAuthStore();
const router = useRouter();
const { t } = useI18n();

const initials = computed(() => {
  const email = auth.user?.email ?? '';
  return email.slice(0, 2).toUpperCase();
});

const RoleIcon = computed(() => (auth.role === 'doctor' ? Stethoscope : HeartPulse));

async function logout() {
  const refresh = tokenStorage.getRefresh() ?? undefined;
  await authApi.logout(refresh).catch(() => undefined);
  auth.clear();
  await router.push({ name: 'login' });
}
</script>

<template>
  <div class="flex min-h-screen flex-col">
    <header class="border-b border-surface-200 bg-white px-6 py-3 shadow-sm">
      <div class="mx-auto flex max-w-6xl items-center justify-between">
        <div class="flex items-center gap-2">
          <component :is="RoleIcon" class="size-6 text-brand-700" />
          <span class="text-lg font-semibold text-surface-900">{{ t('app.name') }}</span>
        </div>
        <div class="flex items-center gap-3">
          <span class="hidden text-sm text-surface-500 sm:inline">{{ auth.user?.email }}</span>
          <div
            class="flex size-9 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700"
          >
            {{ initials }}
          </div>
          <button
            class="flex items-center gap-1 rounded-md px-2 py-1 text-sm text-surface-600 hover:bg-surface-100"
            type="button"
            @click="logout"
          >
            <LogOut class="size-4" />
            {{ t('nav.logout') }}
          </button>
        </div>
      </div>
    </header>
    <main class="mx-auto w-full max-w-6xl flex-1 px-6 py-8">
      <RouterView />
    </main>
  </div>
</template>
