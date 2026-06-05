<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { UserCheck, X } from 'lucide-vue-next';
import { useActingAsStore } from '@/stores/acting-as';

const { t } = useI18n();
const router = useRouter();
const actingAs = useActingAsStore();

async function exit() {
  actingAs.clear();
  await router.push({ name: 'home' });
}
</script>

<template>
  <div v-if="actingAs.party" class="border-b border-accent-200 bg-accent-100">
    <div class="mx-auto flex max-w-6xl items-center justify-between gap-3 px-6 py-2">
      <div class="flex items-center gap-2 text-sm font-medium text-accent-700">
        <UserCheck class="size-4 shrink-0" />
        <span>{{ t('actingAs.banner', { name: actingAs.party.name }) }}</span>
      </div>
      <button
        type="button"
        class="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium text-accent-700 hover:bg-accent-200/40"
        @click="exit"
      >
        <X class="size-4" />
        {{ t('actingAs.exit') }}
      </button>
    </div>
  </div>
</template>
