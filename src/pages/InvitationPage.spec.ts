import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { createPinia } from 'pinia';
import { i18n } from '@/i18n';
import InvitationPage from './InvitationPage.vue';
import type { InvitationSummary } from '@/types';

const lookup = vi.fn();
const requestOtp = vi.fn();
vi.mock('@/api/delegations.api', () => ({
  delegationsApi: {
    lookupInvitation: (...args: unknown[]) => lookup(...args),
    requestOtp: (...args: unknown[]) => requestOtp(...args),
    acceptInvitation: vi.fn(),
    acceptAndSignup: vi.fn(),
    rejectInvitation: vi.fn(),
  },
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { token: 'tok123' }, fullPath: '/inviti/tok123' }),
  useRouter: () => ({ push: vi.fn() }),
  RouterLink: { template: '<a><slot /></a>' },
}));

function makeSummary(over: Partial<InvitationSummary> = {}): InvitationSummary {
  return {
    token: 'tok123',
    requesterName: 'Figlia Rossi',
    requesterRole: 'patient',
    scope: 'full',
    expiresAt: '2026-07-01T00:00:00.000Z',
    requestedExpiresAt: null,
    requestCanSubDelegate: false,
    reason: 'Gestione ricette',
    targetEmail: 'nonna@test.local',
    targetHasAccount: true,
    parentDelegationId: null,
    status: 'pending',
    ...over,
  };
}

function mountPage() {
  return mount(InvitationPage, {
    global: {
      plugins: [createPinia(), i18n, [PrimeVue, {}], ToastService],
      stubs: { Password: true, InputOtp: true, Checkbox: true, Toast: true, RouterLink: true },
    },
  });
}

describe('InvitationPage', () => {
  afterEach(() => vi.clearAllMocks());

  it('shows the requester and reason for a pending invitation', async () => {
    lookup.mockResolvedValue(makeSummary());
    const wrapper = mountPage();
    await flushPromises();

    expect(lookup).toHaveBeenCalledWith('tok123');
    expect(wrapper.text()).toContain('Figlia Rossi');
    expect(wrapper.text()).toContain('Gestione ricette');
  });

  it('requests an OTP and reveals the code step', async () => {
    lookup.mockResolvedValue(makeSummary());
    requestOtp.mockResolvedValue(undefined);
    const wrapper = mountPage();
    await flushPromises();

    const openBtn = wrapper.findAll('button').find((b) => b.text().includes('Apri invito'));
    expect(openBtn).toBeTruthy();
    await openBtn?.trigger('click');
    await flushPromises();

    expect(requestOtp).toHaveBeenCalledWith('tok123');
    expect(wrapper.text()).toContain('codice');
  });

  it('shows a closed message when the invitation is no longer pending', async () => {
    lookup.mockResolvedValue(makeSummary({ status: 'accepted' }));
    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.text()).toContain('accettato');
  });
});
