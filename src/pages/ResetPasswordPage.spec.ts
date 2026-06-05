import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import { i18n } from '@/i18n';
import ResetPasswordPage from './ResetPasswordPage.vue';

const resetPassword = vi.fn();
vi.mock('@/api/auth.api', () => ({
  authApi: { resetPassword: (...args: unknown[]) => resetPassword(...args) },
}));

vi.mock('vue-router', () => ({
  useRoute: () => ({ params: { token: 'reset-tok' } }),
  RouterLink: { template: '<a><slot /></a>' },
}));

// Stub PrimeVue Password to a native input that forwards inputId + v-model, so the form is queryable.
const PasswordStub = {
  props: ['modelValue', 'inputId'],
  emits: ['update:modelValue'],
  template:
    '<input :id="inputId" :value="modelValue" @input="$emit(\'update:modelValue\', $event.target.value)" />',
};

function mountPage() {
  return mount(ResetPasswordPage, {
    global: {
      plugins: [[PrimeVue, {}], i18n],
      stubs: { Password: PasswordStub, RouterLink: true },
    },
  });
}

describe('ResetPasswordPage', () => {
  afterEach(() => vi.clearAllMocks());

  it('submits the new password when it is valid and matches', async () => {
    resetPassword.mockResolvedValue(undefined);
    const wrapper = mountPage();

    await wrapper.find('#password').setValue('a-strong-password');
    await wrapper.find('#confirm').setValue('a-strong-password');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(resetPassword).toHaveBeenCalledWith('reset-tok', 'a-strong-password');
    expect(wrapper.text()).toContain('Password aggiornata');
  });

  it('does not submit when the passwords do not match', async () => {
    resetPassword.mockResolvedValue(undefined);
    const wrapper = mountPage();

    await wrapper.find('#password').setValue('a-strong-password');
    await wrapper.find('#confirm').setValue('different-password');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(resetPassword).not.toHaveBeenCalled();
    expect(wrapper.text()).toContain('non coincidono');
  });

  it('does not submit when the password is too short', async () => {
    resetPassword.mockResolvedValue(undefined);
    const wrapper = mountPage();

    await wrapper.find('#password').setValue('short');
    await wrapper.find('#confirm').setValue('short');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(resetPassword).not.toHaveBeenCalled();
  });
});
