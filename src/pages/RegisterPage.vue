<script setup lang="ts">
import { computed, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';
import SelectButton from 'primevue/selectbutton';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/auth';
import { errorKey } from '@/lib/error-mapping';

const { t } = useI18n();
const auth = useAuthStore();
const router = useRouter();

const role = ref<'patient' | 'doctor'>('patient');
const roleOptions = computed(() => [
  { label: t('auth.register.asPatient'), value: 'patient' as const },
  { label: t('auth.register.asDoctor'), value: 'doctor' as const },
]);

const firstName = ref('');
const lastName = ref('');
const email = ref('');
const password = ref('');
const fiscalCode = ref('');
const specialization = ref('');
const licenseNumber = ref('');
const errorMsg = ref<string | null>(null);
const submitting = ref(false);

async function submit() {
  errorMsg.value = null;
  submitting.value = true;
  try {
    const tokens = await authApi.register({
      email: email.value,
      password: password.value,
      role: role.value,
      firstName: firstName.value,
      lastName: lastName.value,
      fiscalCode: fiscalCode.value ? fiscalCode.value.toUpperCase() : undefined,
      specialization: role.value === 'doctor' ? specialization.value : undefined,
      licenseNumber: role.value === 'doctor' ? licenseNumber.value : undefined,
    });
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
  <div class="flex min-h-screen items-center justify-center bg-surface-50 px-4 py-10">
    <div class="w-full max-w-lg rounded-xl border border-surface-200 bg-white p-8 shadow-sm">
      <h1 class="text-2xl font-semibold text-surface-900">{{ t('auth.register.title') }}</h1>

      <form class="mt-6 space-y-4" @submit.prevent="submit">
        <SelectButton v-model="role" :options="roleOptions" option-label="label" option-value="value" :allow-empty="false" />

        <div class="grid grid-cols-2 gap-3">
          <div>
            <label class="mb-1 block text-sm font-medium text-surface-700" for="first-name">
              {{ t('auth.register.firstName') }}
            </label>
            <InputText id="first-name" v-model="firstName" required class="w-full" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-surface-700" for="last-name">
              {{ t('auth.register.lastName') }}
            </label>
            <InputText id="last-name" v-model="lastName" required class="w-full" />
          </div>
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-surface-700" for="reg-email">
            {{ t('auth.register.email') }}
          </label>
          <InputText id="reg-email" v-model="email" type="email" required class="w-full" />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-surface-700" for="reg-password">
            {{ t('auth.register.password') }}
          </label>
          <Password
            id="reg-password"
            v-model="password"
            toggle-mask
            required
            input-class="w-full"
            class="w-full"
          />
        </div>

        <div>
          <label class="mb-1 block text-sm font-medium text-surface-700" for="fiscal-code">
            {{ t('auth.register.fiscalCode') }}
          </label>
          <InputText id="fiscal-code" v-model="fiscalCode" maxlength="16" class="w-full" />
        </div>

        <template v-if="role === 'doctor'">
          <div>
            <label class="mb-1 block text-sm font-medium text-surface-700" for="specialization">
              {{ t('auth.register.specialization') }}
            </label>
            <InputText id="specialization" v-model="specialization" class="w-full" />
          </div>
          <div>
            <label class="mb-1 block text-sm font-medium text-surface-700" for="license-number">
              {{ t('auth.register.licenseNumber') }}
            </label>
            <InputText id="license-number" v-model="licenseNumber" class="w-full" />
          </div>
        </template>

        <Message v-if="errorMsg" severity="error" :closable="false">{{ errorMsg }}</Message>

        <Button type="submit" :label="t('auth.register.submit')" :loading="submitting" class="w-full" />
      </form>

      <p class="mt-6 text-center text-sm text-surface-500">
        {{ t('auth.register.haveAccount') }}
        <RouterLink to="/login" class="font-medium text-brand-700 hover:underline">
          {{ t('auth.register.loginCta') }}
        </RouterLink>
      </p>
    </div>
  </div>
</template>
