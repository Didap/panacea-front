<script setup lang="ts">
import { useI18n } from 'vue-i18n';
const { t } = useI18n();
</script>

<template>
  <div class="flex min-h-screen flex-col items-center justify-center gap-3 px-4 text-center">
    <h1 class="text-3xl font-semibold text-surface-900">404</h1>
    <p class="text-surface-500">{{ t('errors.NOT_FOUND') }}</p>
    <RouterLink to="/" class="text-brand-700 hover:underline">{{ t('common.back') }}</RouterLink>
  </div>
</template>
