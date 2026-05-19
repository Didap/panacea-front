import type { ApiErrorBody } from '@/types';

export function errorKey(err: unknown): string {
  const body = (err as { response?: { data?: ApiErrorBody } } | undefined)?.response?.data;
  if (body?.code) return `errors.${body.code}`;
  return 'errors.UNKNOWN';
}
