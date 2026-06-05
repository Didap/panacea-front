<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { RouterLink } from 'vue-router';
import { Users } from 'lucide-vue-next';

const { t } = useI18n();
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold text-surface-900">{{ t('doctor.home.title') }}</h1>
    <p class="mt-1 max-w-2xl text-surface-500">{{ t('doctor.home.subtitle') }}</p>

    <div class="mt-10 rounded-xl border border-surface-200 bg-white p-8 shadow-sm">
      <div class="flex items-start gap-4">
        <div
          class="flex size-12 shrink-0 items-center justify-center rounded-lg bg-accent-50 text-accent-600"
        >
          <Users class="size-6" />
        </div>
        <div class="flex-1">
          <h2 class="text-lg font-semibold text-surface-900">
            {{ t('doctor.home.delegationsTitle') }}
          </h2>
          <p class="mt-1 text-surface-500">{{ t('doctor.home.delegationsBody') }}</p>
          <RouterLink
            :to="{ name: 'deleghe' }"
            class="mt-4 inline-flex items-center gap-1 rounded-md bg-brand-700 px-4 py-2 text-sm font-medium text-white hover:bg-brand-800"
          >
            {{ t('doctor.home.delegationsCta') }}
          </RouterLink>
        </div>
      </div>
    </div>
  </div>
</template>
