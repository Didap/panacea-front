<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { authApi } from '@/api/auth.api';
import { errorKey } from '@/lib/error-mapping';

const route = useRoute();
const { t } = useI18n();

const token = String(route.params.token);
const state = ref<'verifying' | 'success' | 'error'>('verifying');
const errorMsg = ref<string | null>(null);

const resendEmail = ref('');
const resending = ref(false);
const resent = ref(false);
const resendError = ref<string | null>(null);

async function verify() {
  state.value = 'verifying';
  try {
    await authApi.verifyEmail(token);
    state.value = 'success';
  } catch (err) {
    errorMsg.value = t(errorKey(err));
    state.value = 'error';
  }
}

async function resend() {
  resending.value = true;
  resendError.value = null;
  try {
    await authApi.resendVerification(resendEmail.value);
    resent.value = true;
  } catch (err) {
    // A real backend response (even an error status) stays success-shaped so it cannot become an
    // account-enumeration oracle; only a transport failure (no response) is surfaced honestly.
    if ((err as { response?: unknown })?.response) {
      resent.value = true;
    } else {
      resendError.value = t(errorKey(err));
    }
  } finally {
    resending.value = false;
  }
}

onMounted(verify);
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-surface-50 px-4">
    <div class="w-full max-w-md rounded-xl border border-surface-200 bg-white p-8 shadow-sm">
      <h1 class="text-2xl font-semibold text-surface-900">{{ t('auth.verify.title') }}</h1>

      <div v-if="state === 'verifying'" class="mt-4 text-surface-500">
        {{ t('common.loading') }}
      </div>

      <div v-else-if="state === 'success'">
        <p class="mt-3 text-surface-600">{{ t('auth.verify.success') }}</p>
        <RouterLink
          to="/login"
          class="mt-6 inline-block text-sm font-medium text-brand-700 hover:underline"
        >
          {{ t('auth.verify.goToLogin') }}
        </RouterLink>
      </div>

      <div v-else>
        <Message severity="error" :closable="false" class="mt-4">{{ errorMsg }}</Message>

        <div v-if="resent" class="mt-6 rounded-lg bg-surface-100 p-4 text-sm text-surface-600">
          {{ t('auth.verify.resent') }}
        </div>
        <form v-else class="mt-6 space-y-3" @submit.prevent="resend">
          <p class="text-sm text-surface-600">{{ t('auth.verify.resendHint') }}</p>
          <InputText
            v-model="resendEmail"
            type="email"
            required
            :placeholder="t('auth.login.email')"
            class="w-full"
          />
          <Button
            type="submit"
            :label="t('auth.verify.resendCta')"
            :loading="resending"
            severity="secondary"
            outlined
            class="w-full"
          />
          <Message v-if="resendError" severity="error" :closable="false">{{ resendError }}</Message>
        </form>

        <p class="mt-6 text-center text-sm">
          <RouterLink to="/login" class="font-medium text-brand-700 hover:underline">
            {{ t('auth.backToLogin') }}
          </RouterLink>
        </p>
      </div>
    </div>
  </div>
</template>
