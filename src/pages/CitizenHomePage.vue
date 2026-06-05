<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import DocumentsPanel from '@/components/DocumentsPanel.vue';

const { t } = useI18n();
</script>

<template>
  <DocumentsPanel>
    <template #heading>
      <h1 class="text-3xl font-semibold text-surface-900">{{ t('citizen.home.title') }}</h1>
      <p class="mt-1 max-w-2xl text-surface-500">{{ t('citizen.home.subtitle') }}</p>
    </template>
  </DocumentsPanel>
</template>
