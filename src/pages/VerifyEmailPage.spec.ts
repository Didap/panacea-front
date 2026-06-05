import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import { i18n } from '@/i18n';
import VerifyEmailPage from './VerifyEmailPage.vue';

const verifyEmail = vi.fn();
const resendVerification = vi.fn();
vi.mock('@/api/auth.api', () => ({
  authApi: {
    verifyEmail: (...args: unknown[]) => verifyEmail(...args),
    resendVerification: (...args: unknown[]) => resendVerification(...args),
  },
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { token: 'verify-tok' } }),
  RouterLink: { template: '<a><slot /></a>' },
}));

function mountPage() {
  return mount(VerifyEmailPage, {
    global: { plugins: [[PrimeVue, {}], i18n], stubs: { RouterLink: true } },
  });
}

describe('VerifyEmailPage', () => {
  afterEach(() => vi.clearAllMocks());

  it('verifies the token on mount and shows success', async () => {
    verifyEmail.mockResolvedValue(undefined);
    const wrapper = mountPage();
    await flushPromises();

    expect(verifyEmail).toHaveBeenCalledWith('verify-tok');
    expect(wrapper.text()).toContain('Email verificata');
  });

  it('shows an error and a resend form when the token is invalid, then confirms resend', async () => {
    verifyEmail.mockRejectedValue({ response: { data: { code: 'AUTH_TOKEN_EXPIRED' } } });
    resendVerification.mockResolvedValue(undefined);
    const wrapper = mountPage();
    await flushPromises();

    expect(wrapper.text()).toContain('scaduto');

    await wrapper.find('input[type="email"]').setValue('user@test.local');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(resendVerification).toHaveBeenCalledWith('user@test.local');
    expect(wrapper.text()).toContain('nuovo link');
  });
});
