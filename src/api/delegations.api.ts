import { api } from './client';
import type { Delegation, DelegationRequest, InvitationSummary } from '@/types';

export type CreateDelegationRequestInput = {
  targetEmail: string;
  targetFiscalCode: string;
  requestCanSubDelegate?: boolean;
  requestedExpiresAt?: string;
  reason?: string;
};

export type AcceptInvitationInput = {
  otp: string;
  canSubDelegate?: boolean;
};

export type AcceptAndSignupInput = {
  otp: string;
  password: string;
  firstName: string;
  lastName: string;
  canSubDelegate?: boolean;
};

export type CreateSubDelegationInput = {
  targetEmail: string;
  targetFiscalCode: string;
  expiresAt?: string;
};

export type DelegationListRole = 'delegator' | 'delegate' | 'all';

export type AcceptAndSignupResult = {
  userId: string;
  email: string;
  delegation: Delegation;
};

export const delegationsApi = {
  // The future delegate initiates; targetEmail/targetFiscalCode identify the data owner.
  createRequest(input: CreateDelegationRequestInput) {
    return api.post<DelegationRequest>('/delegation-requests', input).then((r) => r.data);
  },
  listMyRequests() {
    return api.get<DelegationRequest[]>('/delegation-requests/mine').then((r) => r.data);
  },
  cancelRequest(id: string) {
    return api.delete(`/delegation-requests/${id}`).then(() => undefined);
  },
  lookupInvitation(token: string) {
    return api.get<InvitationSummary>(`/inviti/${token}`).then((r) => r.data);
  },
  requestOtp(token: string) {
    return api.post(`/inviti/${token}/otp`).then(() => undefined);
  },
  acceptInvitation(token: string, input: AcceptInvitationInput) {
    return api.post<Delegation>(`/inviti/${token}/accept`, input).then((r) => r.data);
  },
  acceptAndSignup(token: string, input: AcceptAndSignupInput) {
    return api
      .post<AcceptAndSignupResult>(`/inviti/${token}/accept-and-signup`, input)
      .then((r) => r.data);
  },
  rejectInvitation(token: string) {
    return api.post(`/inviti/${token}/reject`).then(() => undefined);
  },
  list(as: DelegationListRole = 'all') {
    return api.get<Delegation[]>('/delegations', { params: { as } }).then((r) => r.data);
  },
  revoke(id: string, reason?: string) {
    return api
      .delete(`/delegations/${id}`, { data: reason ? { reason } : undefined })
      .then(() => undefined);
  },
  createSubDelegation(parentId: string, input: CreateSubDelegationInput) {
    return api.post<Delegation>(`/delegations/${parentId}/sub-delegate`, input).then((r) => r.data);
  },
};
