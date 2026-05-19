<script setup lang="ts">
import { useI18n } from 'vue-i18n';
import { Stethoscope } from 'lucide-vue-next';

const { t } = useI18n();
</script>

<template>
  <div>
    <h1 class="text-3xl font-semibold text-surface-900">{{ t('doctor.home.title') }}</h1>
    <p class="mt-1 max-w-2xl text-surface-500">{{ t('doctor.home.subtitle') }}</p>

    <div
      class="mt-10 flex flex-col items-center rounded-xl border border-dashed border-surface-300 bg-white p-12 text-center"
    >
      <Stethoscope class="size-10 text-surface-300" />
      <p class="mt-3 max-w-md text-surface-500">{{ t('doctor.home.empty') }}</p>
    </div>
  </div>
</template>
