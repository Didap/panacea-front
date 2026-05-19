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
