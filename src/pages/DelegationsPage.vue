<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import { useConfirm } from 'primevue/useconfirm';
import { useToast } from 'primevue/usetoast';
import ConfirmDialog from 'primevue/confirmdialog';
import Toast from 'primevue/toast';
import { UserPlus, UserCheck, ShieldCheck, Users, Mail, Clock, X } from 'lucide-vue-next';
import { delegationsApi } from '@/api/delegations.api';
import { useAuthStore } from '@/stores/auth';
import { useActingAsStore } from '@/stores/acting-as';
import type { Delegation, DelegationRequest } from '@/types';
import { errorKey } from '@/lib/error-mapping';
import RequestDelegationDialog from '@/components/RequestDelegationDialog.vue';
import SubDelegateDialog from '@/components/SubDelegateDialog.vue';

const { t, d } = useI18n();
const router = useRouter();
const confirm = useConfirm();
const toast = useToast();
const auth = useAuthStore();
const actingAs = useActingAsStore();

const loading = ref(false);
const delegations = ref<Delegation[]>([]);
const requests = ref<DelegationRequest[]>([]);
const showInactive = ref(false);
const showRequestDialog = ref(false);
const showSubDialog = ref(false);
const subParentId = ref<string | null>(null);

const meId = computed(() => auth.user?.id ?? '');

function visibleRows(list: Delegation[]) {
  return showInactive.value ? list : list.filter((dg) => dg.status === 'active');
}

const asDelegate = computed(() =>
  visibleRows(delegations.value.filter((dg) => dg.delegateUserId === meId.value)),
);
const asDelegator = computed(() =>
  visibleRows(delegations.value.filter((dg) => dg.delegatorUserId === meId.value)),
);
const sentPending = computed(() =>
  requests.value.filter((r) => r.requestingUserId === meId.value && r.status === 'pending'),
);
const receivedPending = computed(() =>
  requests.value.filter((r) => r.targetUserId === meId.value && r.status === 'pending'),
);

async function load() {
  loading.value = true;
  try {
    const [dgs, reqs] = await Promise.all([
      delegationsApi.list('all'),
      delegationsApi.listMyRequests(),
    ]);
    delegations.value = dgs;
    requests.value = reqs;
  } catch (err) {
    toast.add({ severity: 'error', summary: t(errorKey(err)), life: 4000 });
  } finally {
    loading.value = false;
  }
}

async function operate(dg: Delegation) {
  actingAs.actAs({ delegatorUserId: dg.delegatorUserId, name: dg.delegator.name });
  await router.push({ name: 'delegated-record' });
}

function openSub(dg: Delegation) {
  subParentId.value = dg.id;
  showSubDialog.value = true;
}

function revoke(dg: Delegation) {
  confirm.require({
    message: t('deleghe.revoke.confirm'),
    acceptLabel: t('common.yes'),
    rejectLabel: t('common.no'),
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await delegationsApi.revoke(dg.id);
        // Drop the acting-as session if it pointed at the record we just closed.
        if (actingAs.party?.delegatorUserId === dg.delegatorUserId) actingAs.clear();
        await load();
      } catch (err) {
        toast.add({ severity: 'error', summary: t(errorKey(err)), life: 4000 });
      }
    },
  });
}

function cancelRequest(r: DelegationRequest) {
  confirm.require({
    message: t('deleghe.invites.cancelConfirm'),
    acceptLabel: t('common.yes'),
    rejectLabel: t('common.no'),
    acceptClass: 'p-button-danger',
    accept: async () => {
      try {
        await delegationsApi.cancelRequest(r.id);
        await load();
      } catch (err) {
        toast.add({ severity: 'error', summary: t(errorKey(err)), life: 4000 });
      }
    },
  });
}

function statusSeverity(status: string): 'success' | 'warn' | 'danger' {
  if (status === 'active') return 'success';
  if (status === 'expired') return 'warn';
  return 'danger';
}

onMounted(load);
</script>

<template>
  <Toast />
  <ConfirmDialog />

  <div class="flex items-start justify-between gap-4">
    <div>
      <h1 class="text-3xl font-semibold text-surface-900">{{ t('deleghe.title') }}</h1>
      <p class="mt-1 max-w-2xl text-surface-500">{{ t('deleghe.subtitle') }}</p>
    </div>
    <Button :label="t('deleghe.request.cta')" @click="showRequestDialog = true">
      <template #icon><UserPlus class="size-4" /></template>
    </Button>
  </div>

  <label class="mt-4 flex w-fit items-center gap-2 text-sm text-surface-600">
    <input v-model="showInactive" type="checkbox" class="size-4 accent-brand-600" />
    {{ t('deleghe.showInactive') }}
  </label>

  <div v-if="loading" class="mt-8 text-surface-500">{{ t('common.loading') }}</div>

  <template v-else>
    <section class="mt-8">
      <h2 class="flex items-center gap-2 text-lg font-semibold text-surface-900">
        <UserCheck class="size-5 text-accent-600" />
        {{ t('deleghe.asDelegate.title') }}
      </h2>
      <p class="mt-1 text-sm text-surface-500">{{ t('deleghe.asDelegate.subtitle') }}</p>

      <div
        v-if="asDelegate.length === 0"
        class="mt-4 rounded-lg border border-dashed border-surface-300 bg-white p-6 text-sm text-surface-500"
      >
        {{ t('deleghe.asDelegate.empty') }}
      </div>
      <ul v-else class="mt-4 grid gap-3">
        <li
          v-for="dg in asDelegate"
          :key="dg.id"
          class="rounded-lg border border-surface-200 bg-white p-4 shadow-sm"
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="font-medium text-surface-900">{{ dg.delegator.name }}</p>
              <p class="mt-0.5 text-sm text-surface-500">{{ dg.delegator.email }}</p>
            </div>
            <div class="flex items-center gap-2">
              <Tag
                :value="t(`deleghe.status.${dg.status}`)"
                :severity="statusSeverity(dg.status)"
              />
              <span v-if="dg.expiresAt" class="flex items-center gap-1 text-xs text-surface-500">
                <Clock class="size-3.5" /> {{ t('deleghe.expiresOn') }}
                {{ d(dg.expiresAt, 'short') }}
              </span>
            </div>
          </div>
          <div v-if="dg.status === 'active'" class="mt-3 flex flex-wrap gap-2">
            <Button
              size="small"
              :label="t('deleghe.operate', { name: dg.delegator.name })"
              @click="operate(dg)"
            >
              <template #icon><UserCheck class="size-4" /></template>
            </Button>
            <Button
              v-if="dg.canSubDelegate"
              size="small"
              severity="secondary"
              outlined
              :label="t('deleghe.sub.cta')"
              @click="openSub(dg)"
            >
              <template #icon><ShieldCheck class="size-4" /></template>
            </Button>
            <Button
              size="small"
              severity="danger"
              text
              :label="t('deleghe.revoke.cta')"
              @click="revoke(dg)"
            />
          </div>
        </li>
      </ul>
    </section>

    <section class="mt-10">
      <h2 class="flex items-center gap-2 text-lg font-semibold text-surface-900">
        <Users class="size-5 text-brand-700" />
        {{ t('deleghe.asDelegator.title') }}
      </h2>
      <p class="mt-1 text-sm text-surface-500">{{ t('deleghe.asDelegator.subtitle') }}</p>

      <div
        v-if="asDelegator.length === 0"
        class="mt-4 rounded-lg border border-dashed border-surface-300 bg-white p-6 text-sm text-surface-500"
      >
        {{ t('deleghe.asDelegator.empty') }}
      </div>
      <ul v-else class="mt-4 grid gap-3">
        <li
          v-for="dg in asDelegator"
          :key="dg.id"
          class="rounded-lg border border-surface-200 bg-white p-4 shadow-sm"
        >
          <div class="flex flex-wrap items-center justify-between gap-3">
            <div class="min-w-0">
              <p class="font-medium text-surface-900">{{ dg.delegate.name }}</p>
              <p class="mt-0.5 text-sm text-surface-500">{{ dg.delegate.email }}</p>
            </div>
            <div class="flex items-center gap-2">
              <Tag
                :value="t(`deleghe.status.${dg.status}`)"
                :severity="statusSeverity(dg.status)"
              />
              <span v-if="dg.expiresAt" class="flex items-center gap-1 text-xs text-surface-500">
                <Clock class="size-3.5" /> {{ t('deleghe.expiresOn') }}
                {{ d(dg.expiresAt, 'short') }}
              </span>
            </div>
          </div>
          <div v-if="dg.status === 'active'" class="mt-3">
            <Button
              size="small"
              severity="danger"
              text
              :label="t('deleghe.revoke.cta')"
              @click="revoke(dg)"
            />
          </div>
        </li>
      </ul>
    </section>

    <section v-if="sentPending.length || receivedPending.length" class="mt-10">
      <h2 class="flex items-center gap-2 text-lg font-semibold text-surface-900">
        <Mail class="size-5 text-surface-500" />
        {{ t('deleghe.invites.title') }}
      </h2>
      <ul class="mt-4 grid gap-3">
        <li
          v-for="r in sentPending"
          :key="r.id"
          class="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-surface-200 bg-white p-4 shadow-sm"
        >
          <div class="min-w-0">
            <p class="text-sm text-surface-900">
              {{ t('deleghe.invites.sentTo', { email: r.targetEmail }) }}
            </p>
            <p class="mt-0.5 text-xs text-surface-500">
              {{ t('deleghe.invites.expiresOn') }} {{ d(r.expiresAt, 'short') }}
            </p>
          </div>
          <Button
            size="small"
            severity="secondary"
            text
            :label="t('deleghe.invites.cancel')"
            @click="cancelRequest(r)"
          >
            <template #icon><X class="size-4" /></template>
          </Button>
        </li>
        <li
          v-for="r in receivedPending"
          :key="r.id"
          class="rounded-lg border border-accent-200 bg-accent-50 p-4"
        >
          <p class="text-sm font-medium text-accent-700">
            {{ t('deleghe.invites.receivedFrom', { name: r.requesterName }) }}
          </p>
          <p class="mt-0.5 text-xs text-surface-500">{{ t('deleghe.invites.checkEmail') }}</p>
        </li>
      </ul>
    </section>
  </template>

  <RequestDelegationDialog v-model:visible="showRequestDialog" @created="load" />
  <SubDelegateDialog v-model:visible="showSubDialog" :parent-id="subParentId" @created="load" />
</template>
