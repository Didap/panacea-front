<script setup lang="ts">
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { authApi } from '@/api/auth.api';
import { errorKey } from '@/lib/error-mapping';

const { t } = useI18n();
const email = ref('');
const submitting = ref(false);
const sent = ref(false);
const errorMsg = ref<string | null>(null);

async function submit() {
  errorMsg.value = null;
  submitting.value = true;
  try {
    await authApi.forgotPassword(email.value);
    // Always success-shaped: the response never reveals whether the account exists.
    sent.value = true;
  } catch (err) {
    errorMsg.value = t(errorKey(err));
  } finally {
    submitting.value = false;
  }
}
</script>

<template>
  <div class="flex min-h-screen items-center justify-center bg-surface-50 px-4">
    <div class="w-full max-w-md rounded-xl border border-surface-200 bg-white p-8 shadow-sm">
      <h1 class="text-2xl font-semibold text-surface-900">{{ t('auth.forgot.title') }}</h1>

      <div v-if="sent">
        <p class="mt-3 text-surface-600">{{ t('auth.forgot.sent') }}</p>
        <RouterLink
          to="/login"
          class="mt-6 inline-block text-sm font-medium text-brand-700 hover:underline"
        >
          {{ t('auth.backToLogin') }}
        </RouterLink>
      </div>

      <div v-else>
        <p class="mt-1 text-sm text-surface-500">{{ t('auth.forgot.subtitle') }}</p>
        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <div>
            <label class="mb-1 block text-sm font-medium text-surface-700" for="email">
              {{ t('auth.login.email') }}
            </label>
            <InputText id="email" v-model="email" type="email" required autofocus class="w-full" />
          </div>

          <Message v-if="errorMsg" severity="error" :closable="false">{{ errorMsg }}</Message>

          <Button
            type="submit"
            :label="t('auth.forgot.submit')"
            :loading="submitting"
            class="w-full"
          />
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
