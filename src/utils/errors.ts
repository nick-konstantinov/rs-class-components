export function getErrorMessage(status: number): string {
  if (status === 404) return 'Not found';
  if (status >= 400 && status < 500) return `Request failed (${status})`;
  if (status >= 500) return 'Server is unavailable, please try again later';
  return 'Unknown error';
}
