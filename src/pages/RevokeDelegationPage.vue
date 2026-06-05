<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { ShieldOff } from 'lucide-vue-next';
import { delegationsApi } from '@/api/delegations.api';
import { useActingAsStore } from '@/stores/acting-as';
import type { Delegation } from '@/types';
import { errorKey } from '@/lib/error-mapping';

const route = useRoute();
const { t } = useI18n();
const toast = useToast();
const actingAs = useActingAsStore();

const id = String(route.params.id);
const loading = ref(true);
const submitting = ref(false);
const done = ref(false);
const delegation = ref<Delegation | null>(null);

const notActionable = computed(
  () =>
    !loading.value && !done.value && (!delegation.value || delegation.value.status !== 'active'),
);

async function load() {
  loading.value = true;
  try {
    const list = await delegationsApi.list('all');
    delegation.value = list.find((dg) => dg.id === id) ?? null;
  } catch (err) {
    toast.add({ severity: 'error', summary: t(errorKey(err)), life: 4000 });
  } finally {
    loading.value = false;
  }
}

async function revoke() {
  submitting.value = true;
  try {
    await delegationsApi.revoke(id);
    if (
      actingAs.party &&
      delegation.value &&
      actingAs.party.delegatorUserId === delegation.value.delegatorUserId
    ) {
      actingAs.clear();
    }
    done.value = true;
    toast.add({ severity: 'success', summary: t('deleghe.revoke.done'), life: 4000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: t(errorKey(err)), life: 4000 });
  } finally {
    submitting.value = false;
  }
}

onMounted(load);
</script>

<template>
  <Toast />
  <div class="mx-auto max-w-md">
    <div class="rounded-xl border border-surface-200 bg-white p-6 shadow-sm">
      <div class="flex items-center gap-2 text-danger">
        <ShieldOff class="size-5" />
        <h1 class="text-lg font-semibold text-surface-900">{{ t('deleghe.revoke.pageTitle') }}</h1>
      </div>

      <div v-if="loading" class="mt-6 text-surface-500">{{ t('common.loading') }}</div>

      <div v-else-if="done" class="mt-6">
        <p class="text-surface-700">{{ t('deleghe.revoke.doneBody') }}</p>
        <RouterLink
          :to="{ name: 'deleghe' }"
          class="mt-4 inline-block text-sm font-medium text-brand-700"
        >
          {{ t('deleghe.revoke.backToList') }}
        </RouterLink>
      </div>

      <div v-else-if="notActionable" class="mt-6">
        <p class="text-surface-600">{{ t('deleghe.revoke.notActionable') }}</p>
        <RouterLink
          :to="{ name: 'deleghe' }"
          class="mt-4 inline-block text-sm font-medium text-brand-700"
        >
          {{ t('deleghe.revoke.backToList') }}
        </RouterLink>
      </div>

      <template v-else-if="delegation">
        <p class="mt-4 text-surface-700">
          {{ t('deleghe.revoke.pageBody', { name: delegation.delegate.name }) }}
        </p>
        <div class="mt-6 flex justify-end gap-2">
          <RouterLink
            :to="{ name: 'deleghe' }"
            class="rounded-md px-3 py-2 text-sm font-medium text-surface-600 hover:bg-surface-100"
          >
            {{ t('common.cancel') }}
          </RouterLink>
          <Button
            severity="danger"
            :label="t('deleghe.revoke.cta')"
            :loading="submitting"
            @click="revoke"
          />
        </div>
      </template>
    </div>
  </div>
</template>
