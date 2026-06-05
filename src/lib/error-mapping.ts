import type { ApiErrorBody } from '@/types';
import { i18n } from '@/i18n';

export function errorKey(err: unknown): string {
  const body = (err as { response?: { data?: ApiErrorBody } } | undefined)?.response?.data;
  const key = body?.code ? `errors.${body.code}` : 'errors.UNKNOWN';
  // Fall back to a generic message rather than rendering a raw 'errors.SOMETHING' key to the user.
  return i18n.global.te(key) ? key : 'errors.UNKNOWN';
}
