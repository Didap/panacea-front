<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import Button from 'primevue/button';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import InputOtp from 'primevue/inputotp';
import Checkbox from 'primevue/checkbox';
import Toast from 'primevue/toast';
import { useToast } from 'primevue/usetoast';
import { ShieldCheck, Clock } from 'lucide-vue-next';
import { delegationsApi } from '@/api/delegations.api';
import { authApi } from '@/api/auth.api';
import { useAuthStore } from '@/stores/auth';
import type { InvitationSummary } from '@/types';
import { errorKey } from '@/lib/error-mapping';

const route = useRoute();
const router = useRouter();
const auth = useAuthStore();
const { t, d } = useI18n();
const toast = useToast();

const token = String(route.params.token);
const loading = ref(true);
const loadError = ref<string | null>(null);
const invitation = ref<InvitationSummary | null>(null);

const otpRequested = ref(false);
const otp = ref('');
const canSubDelegate = ref(false);
const submitting = ref(false);
const signup = ref({ firstName: '', lastName: '', password: '' });

const isPending = computed(() => invitation.value?.status === 'pending');
const needsAccount = computed(() =>
  invitation.value ? !invitation.value.targetHasAccount : false,
);
const otpValid = computed(() => /^\d{6}$/.test(otp.value));
const signupValid = computed(
  () =>
    signup.value.firstName.trim().length > 0 &&
    signup.value.lastName.trim().length > 0 &&
    signup.value.password.length >= 8,
);
const loginLink = computed(() => ({ name: 'login', query: { next: route.fullPath } }));

async function lookup() {
  loading.value = true;
  loadError.value = null;
  try {
    invitation.value = await delegationsApi.lookupInvitation(token);
  } catch (err) {
    loadError.value = t(errorKey(err));
  } finally {
    loading.value = false;
  }
}

async function requestOtp() {
  submitting.value = true;
  try {
    await delegationsApi.requestOtp(token);
    otpRequested.value = true;
    toast.add({ severity: 'success', summary: t('inviti.otpSent'), life: 4000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: t(errorKey(err)), life: 4000 });
  } finally {
    submitting.value = false;
  }
}

function subOverride(): boolean | undefined {
  return invitation.value?.requestCanSubDelegate ? canSubDelegate.value : undefined;
}

async function accept() {
  submitting.value = true;
  try {
    await delegationsApi.acceptInvitation(token, { otp: otp.value, canSubDelegate: subOverride() });
    toast.add({ severity: 'success', summary: t('inviti.accepted'), life: 4000 });
    await router.push({ name: 'deleghe' });
  } catch (err) {
    toast.add({ severity: 'error', summary: t(errorKey(err)), life: 4000 });
  } finally {
    submitting.value = false;
  }
}

async function acceptAndSignup() {
  if (!invitation.value) return;
  submitting.value = true;
  try {
    const res = await delegationsApi.acceptAndSignup(token, {
      otp: otp.value,
      password: signup.value.password,
      firstName: signup.value.firstName.trim(),
      lastName: signup.value.lastName.trim(),
      canSubDelegate: subOverride(),
    });
    // accept-and-signup creates the account but issues no tokens; log in with the new credentials.
    const tokens = await authApi.login(res.email, signup.value.password);
    auth.setTokens(tokens);
    toast.add({ severity: 'success', summary: t('inviti.accountCreated'), life: 4000 });
    await router.push({ name: 'home' });
  } catch (err) {
    toast.add({ severity: 'error', summary: t(errorKey(err)), life: 4000 });
  } finally {
    submitting.value = false;
  }
}

async function reject() {
  submitting.value = true;
  try {
    await delegationsApi.rejectInvitation(token);
    if (invitation.value) invitation.value.status = 'rejected';
    toast.add({ severity: 'info', summary: t('inviti.rejected'), life: 4000 });
  } catch (err) {
    toast.add({ severity: 'error', summary: t(errorKey(err)), life: 4000 });
  } finally {
    submitting.value = false;
  }
}

onMounted(lookup);
</script>

<template>
  <Toast />
  <div class="flex min-h-screen items-center justify-center bg-surface-50 px-4 py-10">
    <div
      class="w-full max-w-md overflow-hidden rounded-xl border border-surface-200 bg-white shadow-md"
    >
      <div class="h-1.5 bg-accent-500" />
      <div class="p-6">
        <div class="flex items-center gap-2 text-accent-700">
          <ShieldCheck class="size-5" />
          <span class="text-sm font-semibold uppercase tracking-wide">{{ t('inviti.badge') }}</span>
        </div>

        <div v-if="loading" class="mt-6 text-surface-500">{{ t('common.loading') }}</div>

        <div v-else-if="loadError" class="mt-6">
          <p class="text-surface-700">{{ loadError }}</p>
          <RouterLink
            :to="{ name: 'login' }"
            class="mt-4 inline-block text-sm font-medium text-brand-700"
          >
            {{ t('inviti.goToLogin') }}
          </RouterLink>
        </div>

        <template v-else-if="invitation">
          <h1 class="mt-4 text-xl font-semibold text-surface-900">{{ t('inviti.title') }}</h1>
          <p class="mt-2 text-surface-600">
            {{
              t('inviti.intro', {
                name: invitation.requesterName,
                role: t(`inviti.role.${invitation.requesterRole}`),
              })
            }}
          </p>

          <div class="mt-4 space-y-2 rounded-lg bg-accent-50 p-4 text-sm">
            <p class="text-surface-700">
              <span class="font-medium">{{ t('inviti.scope') }}:</span> {{ t('inviti.scopeFull') }}
            </p>
            <p v-if="invitation.reason" class="text-surface-700">
              <span class="font-medium">{{ t('inviti.reason') }}:</span> {{ invitation.reason }}
            </p>
            <p class="text-surface-700">
              <span class="font-medium">{{ t('inviti.account') }}:</span>
              {{ invitation.targetEmail }}
            </p>
            <p
              v-if="invitation.requestedExpiresAt"
              class="flex items-center gap-1 text-surface-600"
            >
              <Clock class="size-3.5" /> {{ t('inviti.expiresOn') }}
              {{ d(invitation.requestedExpiresAt, 'short') }}
            </p>
            <p v-else class="text-surface-600">{{ t('inviti.permanent') }}</p>
          </div>

          <div
            v-if="!isPending"
            class="mt-6 rounded-lg bg-surface-100 p-4 text-sm text-surface-600"
          >
            {{ t(`inviti.closed.${invitation.status}`) }}
          </div>

          <template v-else>
            <div v-if="!otpRequested" class="mt-6 flex flex-col gap-2">
              <Button :label="t('inviti.openCta')" :loading="submitting" @click="requestOtp" />
              <Button
                :label="t('inviti.rejectCta')"
                severity="secondary"
                text
                :loading="submitting"
                @click="reject"
              />
            </div>

            <div v-else class="mt-6">
              <p class="text-sm text-surface-600">
                {{ t('inviti.otpHint', { email: invitation.targetEmail }) }}
              </p>
              <div class="mt-3">
                <InputOtp v-model="otp" :length="6" integer-only />
              </div>

              <div v-if="needsAccount" class="mt-4 space-y-3">
                <p class="text-sm font-medium text-surface-700">{{ t('inviti.createAccount') }}</p>
                <div class="grid grid-cols-2 gap-2">
                  <InputText
                    v-model="signup.firstName"
                    :placeholder="t('inviti.firstName')"
                    class="w-full"
                  />
                  <InputText
                    v-model="signup.lastName"
                    :placeholder="t('inviti.lastName')"
                    class="w-full"
                  />
                </div>
                <Password
                  v-model="signup.password"
                  :feedback="false"
                  toggle-mask
                  fluid
                  :placeholder="t('inviti.password')"
                />
                <div v-if="invitation.requestCanSubDelegate" class="flex items-start gap-2">
                  <Checkbox v-model="canSubDelegate" binary input-id="inv-sub" />
                  <label for="inv-sub" class="text-sm text-surface-600">
                    {{ t('inviti.allowSubDelegate') }}
                  </label>
                </div>
                <Button
                  :label="t('inviti.acceptSignupCta')"
                  class="w-full"
                  :loading="submitting"
                  :disabled="!otpValid || !signupValid"
                  @click="acceptAndSignup"
                />
              </div>

              <div v-else-if="auth.isAuthenticated" class="mt-4 space-y-3">
                <div v-if="invitation.requestCanSubDelegate" class="flex items-start gap-2">
                  <Checkbox v-model="canSubDelegate" binary input-id="inv-sub2" />
                  <label for="inv-sub2" class="text-sm text-surface-600">
                    {{ t('inviti.allowSubDelegate') }}
                  </label>
                </div>
                <Button
                  :label="t('inviti.acceptCta')"
                  class="w-full"
                  :loading="submitting"
                  :disabled="!otpValid"
                  @click="accept"
                />
              </div>

              <div v-else class="mt-4 rounded-lg bg-surface-100 p-4 text-sm text-surface-600">
                <p>{{ t('inviti.loginToAccept', { email: invitation.targetEmail }) }}</p>
                <RouterLink :to="loginLink" class="mt-2 inline-block font-medium text-brand-700">
                  {{ t('inviti.goToLogin') }}
                </RouterLink>
              </div>
            </div>
          </template>
        </template>
      </div>
    </div>
  </div>
</template>
