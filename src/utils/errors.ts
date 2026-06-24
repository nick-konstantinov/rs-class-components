import type { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import type { SerializedError } from '@reduxjs/toolkit';

export function getErrorMessage(status: number): string {
  if (status === 404) return 'Not found';
  if (status >= 400 && status < 500) return `Request failed (${status})`;
  if (status >= 500) return 'Server is unavailable, please try again later';
  return 'Unknown error';
}

export function getQueryErrorMessage(
  error: FetchBaseQueryError | SerializedError | undefined,
): string {
  if (!error) return 'Unknown error';

  if ('status' in error) {
    if (typeof error.status === 'number') return getErrorMessage(error.status);
    return 'Network error, please check your connection';
  }

  return error.message ?? 'Unknown error';
}
