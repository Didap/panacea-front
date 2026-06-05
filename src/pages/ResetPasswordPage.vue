<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRoute } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { authApi } from '@/api/auth.api';
import { errorKey } from '@/lib/error-mapping';

const route = useRoute();
const { t } = useI18n();

const token = String(route.params.token);
const password = ref('');
const confirm = ref('');
const submitting = ref(false);
const done = ref(false);
const errorMsg = ref<string | null>(null);

const tooShort = computed(() => password.value.length > 0 && password.value.length < 8);
const mismatch = computed(() => confirm.value.length > 0 && password.value !== confirm.value);
const valid = computed(() => password.value.length >= 8 && password.value === confirm.value);

async function submit() {
  if (!valid.value) return;
  errorMsg.value = null;
  submitting.value = true;
  try {
    await authApi.resetPassword(token, password.value);
    done.value = true;
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
      <h1 class="text-2xl font-semibold text-surface-900">{{ t('auth.reset.title') }}</h1>

      <div v-if="done">
        <p class="mt-3 text-surface-600">{{ t('auth.reset.done') }}</p>
        <RouterLink
          to="/login"
          class="mt-6 inline-block text-sm font-medium text-brand-700 hover:underline"
        >
          {{ t('auth.reset.goToLogin') }}
        </RouterLink>
      </div>

      <div v-else>
        <p class="mt-1 text-sm text-surface-500">{{ t('auth.reset.subtitle') }}</p>
        <form class="mt-6 space-y-4" @submit.prevent="submit">
          <div>
            <label class="mb-1 block text-sm font-medium text-surface-700" for="password">
              {{ t('auth.reset.newPassword') }}
            </label>
            <Password
              input-id="password"
              v-model="password"
              :feedback="false"
              toggle-mask
              fluid
              autofocus
            />
            <p v-if="tooShort" class="mt-1 text-xs text-danger">{{ t('auth.reset.tooShort') }}</p>
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-surface-700" for="confirm">
              {{ t('auth.reset.confirm') }}
            </label>
            <Password input-id="confirm" v-model="confirm" :feedback="false" toggle-mask fluid />
            <p v-if="mismatch" class="mt-1 text-xs text-danger">{{ t('auth.reset.mismatch') }}</p>
          </div>

          <Message v-if="errorMsg" severity="error" :closable="false">{{ errorMsg }}</Message>

          <Button
            type="submit"
            :label="t('auth.reset.submit')"
            :loading="submitting"
            :disabled="!valid"
            class="w-full"
          />
        </form>
      </div>
    </div>
  </div>
</template>
