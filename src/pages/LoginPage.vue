<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/auth';
import { errorKey } from '@/lib/error-mapping';

const { t } = useI18n();
const auth = useAuthStore();
const router = useRouter();

const email = ref('');
const password = ref('');
const errorMsg = ref<string | null>(null);
const submitting = ref(false);

async function submit() {
  errorMsg.value = null;
  submitting.value = true;
  try {
    const tokens = await authApi.login(email.value, password.value);
    auth.setTokens(tokens);
    await router.push({ name: 'home' });
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
      <h1 class="text-2xl font-semibold text-surface-900">{{ t('auth.login.title') }}</h1>
      <p class="mt-1 text-sm text-surface-500">{{ t('app.tagline') }}</p>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <div>
          <label class="mb-1 block text-sm font-medium text-surface-700" for="email">
            {{ t('auth.login.email') }}
          </label>
          <InputText id="email" v-model="email" type="email" required autofocus class="w-full" />
        </div>
        <div>
          <label class="mb-1 block text-sm font-medium text-surface-700" for="password">
            {{ t('auth.login.password') }}
          </label>
          <Password
            id="password"
            v-model="password"
            :feedback="false"
            toggle-mask
            required
            input-class="w-full"
            class="w-full"
          />
        </div>

        <Message v-if="errorMsg" severity="error" :closable="false">{{ errorMsg }}</Message>

        <Button type="submit" :label="t('auth.login.submit')" :loading="submitting" class="w-full" />
      </form>

      <p class="mt-6 text-center text-sm text-surface-500">
        {{ t('auth.login.noAccount') }}
        <RouterLink to="/register" class="font-medium text-brand-700 hover:underline">
          {{ t('auth.login.signupCta') }}
        </RouterLink>
      </p>
    </div>
  </div>
</template>
