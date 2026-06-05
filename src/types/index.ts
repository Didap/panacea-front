export type UserRole = 'patient' | 'doctor' | 'institution_admin';

export type AuthenticatedUser = {
  id: string;
  email: string;
  role: UserRole;
};

export type Tokens = {
  accessToken: string;
  refreshToken: string;
  accessExpiresAt: string;
  refreshExpiresAt: string;
};

export type DocumentCategory =
  | 'referto'
  | 'esame_laboratorio'
  | 'esame_strumentale'
  | 'ricetta'
  | 'lettera_dimissione'
  | 'certificato'
  | 'altro';

export type HealthDocument = {
  id: string;
  ownerPatientId: string;
  uploadedByUserId: string;
  category: DocumentCategory;
  title: string;
  notes: string | null;
  fileName: string;
  mimeType: string;
  sizeBytes: number;
  storageDriver: string;
  storageKey: string;
  takenAt: string | null;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
};

export type PatientProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  fiscalCode: string | null;
  birthDate: string | null;
  gender: 'M' | 'F' | 'X' | null;
  phone: string | null;
};

export type DoctorProfile = {
  userId: string;
  firstName: string;
  lastName: string;
  fiscalCode: string | null;
  specialization: string | null;
  licenseNumber: string | null;
  phone: string | null;
};

export type Me = {
  user: AuthenticatedUser & {
    emailVerifiedAt: string | null;
    createdAt: string;
  };
  profile: PatientProfile | DoctorProfile | null;
};

export type ApiErrorBody = {
  code: string;
  message: string;
  details?: unknown;
  requestId?: string;
};

export type DelegationStatus = 'active' | 'revoked' | 'expired';

export type DelegationRequestStatus =
  | 'pending'
  | 'accepted'
  | 'rejected'
  | 'expired'
  | 'cancelled'
  | 'auto_approved';

export type DelegationScope = 'full';

export type PartySummary = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
};

export type Delegation = {
  id: string;
  delegatorUserId: string;
  delegateUserId: string;
  parentDelegationId: string | null;
  scope: DelegationScope;
  status: DelegationStatus;
  canSubDelegate: boolean;
  expiresAt: string | null;
  grantedAt: string;
  revokedAt: string | null;
  revokedByUserId: string | null;
  revocationReason: string | null;
  originatingRequestId: string | null;
  createdAt: string;
  updatedAt: string;
  delegator: PartySummary;
  delegate: PartySummary;
};

export type DelegationRequest = {
  id: string;
  requestingUserId: string;
  targetEmail: string;
  targetFiscalCode: string;
  targetUserId: string | null;
  parentDelegationId: string | null;
  requestedScope: DelegationScope;
  requestedExpiresAt: string | null;
  requestCanSubDelegate: boolean;
  reason: string | null;
  status: DelegationRequestStatus;
  expiresAt: string;
  sentAt: string | null;
  acceptedAt: string | null;
  rejectedAt: string | null;
  cancelledAt: string | null;
  createdAt: string;
  updatedAt: string;
  requesterName: string;
  targetName: string | null;
};

export type InvitationSummary = {
  token: string;
  requesterName: string;
  requesterRole: UserRole;
  scope: DelegationScope;
  expiresAt: string;
  requestedExpiresAt: string | null;
  requestCanSubDelegate: boolean;
  reason: string | null;
  targetEmail: string;
  targetHasAccount: boolean;
  parentDelegationId: string | null;
  status: DelegationRequestStatus;
};
