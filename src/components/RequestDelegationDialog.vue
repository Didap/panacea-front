<script setup lang="ts">
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import Dialog from 'primevue/dialog';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import DatePicker from 'primevue/datepicker';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';
import { useToast } from 'primevue/usetoast';
import { delegationsApi } from '@/api/delegations.api';
import { errorKey } from '@/lib/error-mapping';

const visible = defineModel<boolean>('visible', { required: true });
const emit = defineEmits<{ created: [] }>();

const { t } = useI18n();
const toast = useToast();

const today = new Date();
const submitting = ref(false);
const form = ref({
  targetEmail: '',
  targetFiscalCode: '',
  reason: '',
  expiresAt: null as Date | null,
  canSubDelegate: false,
});

const FISCAL_RE = /^[A-Z0-9]{16}$/;
const fiscalValid = computed(() => FISCAL_RE.test(form.value.targetFiscalCode));
const emailValid = computed(() => /.+@.+\..+/.test(form.value.targetEmail));
const canSubmit = computed(() => emailValid.value && fiscalValid.value && !submitting.value);

function onFiscalInput() {
  form.value.targetFiscalCode = form.value.targetFiscalCode.toUpperCase().replace(/\s/g, '');
}

function reset() {
  form.value = {
    targetEmail: '',
    targetFiscalCode: '',
    reason: '',
    expiresAt: null,
    canSubDelegate: false,
  };
}

async function submit() {
  if (!canSubmit.value) return;
  submitting.value = true;
  try {
    await delegationsApi.createRequest({
      targetEmail: form.value.targetEmail.trim().toLowerCase(),
      targetFiscalCode: form.value.targetFiscalCode,
      requestCanSubDelegate: form.value.canSubDelegate || undefined,
      requestedExpiresAt: form.value.expiresAt ? form.value.expiresAt.toISOString() : undefined,
      reason: form.value.reason.trim() || undefined,
    });
    toast.add({ severity: 'success', summary: t('deleghe.request.sent'), life: 4000 });
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
  <Dialog
    v-model:visible="visible"
    modal
    :header="t('deleghe.request.title')"
    class="w-full max-w-md"
  >
    <form class="space-y-4" @submit.prevent="submit">
      <p class="text-sm text-surface-500">{{ t('deleghe.request.intro') }}</p>
      <div>
        <label class="mb-1 block text-sm font-medium" for="req-email">
          {{ t('deleghe.request.email') }}
        </label>
        <InputText id="req-email" v-model="form.targetEmail" type="email" required class="w-full" />
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium" for="req-fiscal">
          {{ t('deleghe.request.fiscalCode') }}
        </label>
        <InputText
          id="req-fiscal"
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
        <label class="mb-1 block text-sm font-medium" for="req-expires">
          {{ t('deleghe.request.expiresAt') }}
        </label>
        <DatePicker
          id="req-expires"
          v-model="form.expiresAt"
          date-format="yy-mm-dd"
          :min-date="today"
          show-button-bar
          class="w-full"
        />
      </div>
      <div class="flex items-start gap-2">
        <Checkbox v-model="form.canSubDelegate" binary input-id="req-sub" />
        <label for="req-sub" class="text-sm text-surface-600">
          {{ t('deleghe.request.canSubDelegate') }}
        </label>
      </div>
      <div>
        <label class="mb-1 block text-sm font-medium" for="req-reason">
          {{ t('deleghe.request.reason') }}
        </label>
        <Textarea id="req-reason" v-model="form.reason" rows="2" maxlength="1000" class="w-full" />
      </div>
      <div class="flex justify-end gap-2">
        <Button type="button" text :label="t('common.cancel')" @click="visible = false" />
        <Button
          type="submit"
          :label="t('deleghe.request.submit')"
          :loading="submitting"
          :disabled="!canSubmit"
        />
      </div>
    </form>
  </Dialog>
</template>
