<script setup lang="ts">
import { onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useActingAsStore } from '@/stores/acting-as';
import DocumentsPanel from '@/components/DocumentsPanel.vue';

const { t } = useI18n();
const router = useRouter();
const actingAs = useActingAsStore();

onMounted(() => {
  if (!actingAs.party) void router.replace({ name: 'deleghe' });
});
</script>

<template>
  <DocumentsPanel v-if="actingAs.party">
    <template #heading>
      <h1 class="text-3xl font-semibold text-surface-900">
        {{ t('deleghe.record.title', { name: actingAs.party.name }) }}
      </h1>
      <p class="mt-1 max-w-2xl text-surface-500">{{ t('deleghe.record.subtitle') }}</p>
    </template>
  </DocumentsPanel>
</template>
