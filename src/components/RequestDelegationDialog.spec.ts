import { afterEach, describe, expect, it, vi } from 'vitest';
import { flushPromises, mount } from '@vue/test-utils';
import PrimeVue from 'primevue/config';
import ToastService from 'primevue/toastservice';
import { i18n } from '@/i18n';
import RequestDelegationDialog from './RequestDelegationDialog.vue';

const createRequest = vi.fn();
vi.mock('@/api/delegations.api', () => ({
  delegationsApi: { createRequest: (...args: unknown[]) => createRequest(...args) },
}));

function mountDialog() {
  return mount(RequestDelegationDialog, {
    props: { visible: true },
    global: {
      plugins: [[PrimeVue, {}], ToastService, i18n],
      stubs: {
        // PrimeVue teleports the modal; render the content inline so the form is queryable.
        Dialog: { template: '<div><slot /></div>' },
        DatePicker: true,
        Checkbox: true,
        Textarea: true,
      },
    },
  });
}

describe('RequestDelegationDialog', () => {
  afterEach(() => vi.clearAllMocks());

  it('lowercases the email and submits the request', async () => {
    createRequest.mockResolvedValue({});
    const wrapper = mountDialog();

    await wrapper.find('#req-email').setValue('Nonna@Test.Local');
    await wrapper.find('#req-fiscal').setValue('RSSMRA80A01H501Z');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(createRequest).toHaveBeenCalledTimes(1);
    expect(createRequest).toHaveBeenCalledWith(
      expect.objectContaining({
        targetEmail: 'nonna@test.local',
        targetFiscalCode: 'RSSMRA80A01H501Z',
      }),
    );
  });

  it('does not submit when the fiscal code is invalid', async () => {
    createRequest.mockResolvedValue({});
    const wrapper = mountDialog();

    await wrapper.find('#req-email').setValue('a@b.co');
    await wrapper.find('#req-fiscal').setValue('TOOSHORT');
    await wrapper.find('form').trigger('submit');
    await flushPromises();

    expect(createRequest).not.toHaveBeenCalled();
  });
});
