<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import DatePicker from 'primevue/datepicker';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { delegationsApi } from '@/api/delegations.api';
import { errorKey } from '@/lib/error-mapping';

const visible = defineModel<boolean>('visible', { required: true });
const props = defineProps<{ parentId: string | null }>();
const emit = defineEmits<{ created: [] }>();

const { t } = useI18n();
const toast = useToast();

const today = new Date();
const submitting = ref(false);
const form = ref({ targetEmail: '', targetFiscalCode: '', expiresAt: null as Date | null });

const FISCAL_RE = /^[A-Z0-9]{16}$/;
const fiscalValid = computed(() => FISCAL_RE.test(form.value.targetFiscalCode));
const emailValid = computed(() => /.+@.+\..+/.test(form.value.targetEmail));
const canSubmit = computed(
  () => Boolean(props.parentId) && emailValid.value && fiscalValid.value && !submitting.value,
);

function onFiscalInput() {
  form.value.targetFiscalCode = form.value.targetFiscalCode.toUpperCase().replace(/\s/g, '');
}

function reset() {
  form.value = { targetEmail: '', targetFiscalCode: '', expiresAt: null };
}

async function submit() {
  if (!canSubmit.value || !props.parentId) return;
  submitting.value = true;
  try {
    await delegationsApi.createSubDelegation(props.parentId, {
      targetEmail: form.value.targetEmail.trim().toLowerCase(),
      targetFiscalCode: form.value.targetFiscalCode,
      expiresAt: form.value.expiresAt ? form.value.expiresAt.toISOString() : undefined,
    });
    toast.add({ severity: 'success', summary: t('deleghe.sub.created'), life: 4000 });
    visible.value = false;
    reset();
    emit('created');
  } catch (err) {
    toast.add({ severity: 'error', summary: t(errorKey(err)), life: 4000 });
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <Dialog v-model:visible="visible" modal :header="t('deleghe.sub.title')" class="w-full max-w-md">
    <form class="space-y-4" @submit.prevent="submit">
      <p class="text-sm text-surface-500">{{ t('deleghe.sub.intro') }}</p>
      <div>
        <label class="mb-1 block text-sm font-medium" for="sub-email">
          {{ t('deleghe.sub.email') }}
        </label>
        <InputText id="sub-email" v-model="form.targetEmail" type="email" required class="w-full" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium" for="sub-fiscal">
          {{ t('deleghe.sub.fiscalCode') }}
        </label>
        <InputText
          id="sub-fiscal"
          v-model="form.targetFiscalCode"
          required
          maxlength="16"
          class="w-full uppercase"
          @input="onFiscalInput"
        />
        <p v-if="form.targetFiscalCode && !fiscalValid" class="mt-1 text-xs text-danger">
          {{ t('deleghe.request.fiscalInvalid') }}
        </p>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium" for="sub-expires">
          {{ t('deleghe.sub.expiresAt') }}
        </label>
        <DatePicker
          id="sub-expires"
          v-model="form.expiresAt"
          date-format="yy-mm-dd"
          :min-date="today"
          show-button-bar
          class="w-full"
        />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" text :label="t('common.cancel')" @click="visible = false" />
        <Button
          type="submit"
          :label="t('deleghe.sub.submit')"
          :loading="submitting"
          :disabled="!canSubmit"
        />
      </div>
    </form>
  </Dialog>
</template>
